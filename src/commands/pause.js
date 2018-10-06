const Command = require('../lib/Command');

const pauseCommand = new Command({
	name: 'Pause',
	triggers: 'pause',
	description: 'Pause current sound of the bot',
	process(client, msg, args) {
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection) {
      voiceConnection.dispatcher.pause();
		}
	}
});

module.exports = pauseCommand;
