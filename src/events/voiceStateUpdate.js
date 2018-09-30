module.exports = (client, oldUser, newUser) => {
  const logger = client._logger;
  const newUserChannel = newUser.voiceChannel
  const oldUserChannel = oldUser.voiceChannel

  if (!oldUserChannel && newUserChannel && !newUser.user.bot) {
      // New Member joined
      if (client._voiceChannel.id == newUser.voiceChannel.id) {
          logger.debug(`${newUser.nickname || newUser.user.username} joined the channel ${newUser.voiceChannel.name}`, 'Discord Client')
          // Do something if needed (currently not anymore)
        //   if (client._voiceChannelConnection) {
        //     const dispatcher = client._voiceChannelConnection.playArbitraryInput('https://translate.google.com/translate_tts?ie=UTF-8&q=Hi!&tl=en&total=1&idx=0&textlen=3&tk=609435.998434&client=t&prev=input&ttsspeed=1');
        //   }
      }
  } else if (!newUserChannel) {
      // User left a channel
  }
}