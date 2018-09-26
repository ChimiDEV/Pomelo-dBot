const Command = require('../lib/Command');
const pingCommand = new Command({
	name: 'Ping',
	triggers: 'ping',
	description: 'First command for testing purpose.',
	process(client, msg, args) {
		msg.channel.send(`${msg.author} pong!`);
		if (args.length >= 1) {
			msg.channel.send('Note that !ping takes no arguments!');
		}
	}
});

module.exports = pingCommand;
