const Command = require('../lib/Command');

const stopCommand = new Command({
	name: 'Stop',
	triggers: 'stop',
	description: 'Stops current sound of the bot',
	process(client, msg, args) {
		const voiceConnection = client.voiceConnections.get(msg.guild.id);
		if (voiceConnection) {
      voiceConnection.dispatcher.end();
		}
	}
});

module.exports = stopCommand;
