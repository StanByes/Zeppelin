import { commandTypeHelpers as ct } from "../../../commandTypes.js";
import { clearUpcomingScheduledPost } from "../../../data/loops/upcomingScheduledPostsLoop.js";
import { sendErrorMessage, sendSuccessMessage } from "../../../pluginUtils.js";
import { sorter } from "../../../utils.js";
import { postCmd } from "../types.js";

export const ScheduledPostsDeleteCmd = postCmd({
  trigger: ["scheduled_posts delete", "scheduled_posts d"],
  permission: "can_post",

  signature: {
    num: ct.number(),
  },

  async run({ message: msg, args, pluginData }) {
    const scheduledPosts = await pluginData.state.scheduledPosts.all();
    scheduledPosts.sort(sorter("post_at"));
    const post = scheduledPosts[args.num - 1];
    if (!post) {
      sendErrorMessage(pluginData, msg.channel, "Scheduled post not found");
      return;
    }

    clearUpcomingScheduledPost(post);
    await pluginData.state.scheduledPosts.delete(post.id);
    sendSuccessMessage(pluginData, msg.channel, "Scheduled post deleted!");
  },
});
