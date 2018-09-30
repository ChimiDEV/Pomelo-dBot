const Command = require('../lib/Command');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const rejoinCommand = new Command({
	name: 'Rejoin',
	description: 'Let the Bot rejoin the voice channel, if something is broken',
	triggers: ['rejoin', 'fuck', 'f'],
	async process(client, msg, args) {
		if (!client._voiceChannelConnection && !client._voiceChannel) {
			return;
		}
		await client._voiceChannelConnection.disconnect();
		await sleep(1000);
		const connection = await client._voiceChannel.join();
		client._voiceChannelConnection = connection;
		client._logger.info(
			`Client rejoined ${client._voiceChannel.name}`,
			'Discord Client'
		);
	}
});

module.exports = rejoinCommand;
