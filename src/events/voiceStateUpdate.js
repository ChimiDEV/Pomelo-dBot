module.exports = (client, oldUser, newUser) => {
  const logger = client._logger;
  const newUserChannel = newUser.voiceChannel
  const oldUserChannel = oldUser.voiceChannel

  if (!oldUserChannel && newUserChannel && !newUser.user.bot) {
      // New Member joined
      if (client._voiceChannel.id == newUser.voiceChannel.id) {
          logger.debug(`${newUser.nickname || newUser.user.username} joined the channel ${newUser.voiceChannel.name}`, 'Discord Client')
          // Do something if needed (currently not anymore)
      }
  } else if (!newUserChannel) {
      // User left a channel
  }
}