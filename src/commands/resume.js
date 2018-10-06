const Command = require('../lib/Command');

const resumeCommand = new Command({
	name: 'Resume',
	triggers: 'resume',
	description: 'Resume current sound of the bot',
	process(client, msg, args) {
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection) {
      voiceConnection.dispatcher.resume();
		}
	}
});

module.exports = resumeCommand;
