import { logVoiceChannelJoin } from "../logFunctions/logVoiceChannelJoin.js";
import { logVoiceChannelLeave } from "../logFunctions/logVoiceChannelLeave.js";
import { logVoiceChannelMove } from "../logFunctions/logVoiceChannelMove.js";
import { logsEvt } from "../types.js";

export const LogsVoiceStateUpdateEvt = logsEvt({
  event: "voiceStateUpdate",

  async listener(meta) {
    const oldChannel = meta.args.oldState.channel;
    const newChannel = meta.args.newState.channel;
    const member = meta.args.newState.member ?? meta.args.oldState.member;

    if (!member) {
      return;
    }

    if (!newChannel && oldChannel) {
      // Leave evt
      logVoiceChannelLeave(meta.pluginData, {
        member,
        channel: oldChannel,
      });
    } else if (!oldChannel && newChannel) {
      // Join Evt
      logVoiceChannelJoin(meta.pluginData, {
        member,
        channel: newChannel,
      });
    } else if (oldChannel && newChannel) {
      if (oldChannel.id === newChannel.id) return;
      logVoiceChannelMove(meta.pluginData, {
        member,
        oldChannel,
        newChannel,
      });
    }
  },
});
