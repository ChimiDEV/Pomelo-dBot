const pingCommand = {
	name: 'Ping',
	triggers: 'ping',
	description: 'First command for testing purpose.',
	process(client, msg, args) {
		msg.channel.send(msg.author + ' pong!');
		if (suffix) {
			msg.channel.send(' Note that !ping takes no arguments!');
		}
	}
};

module.exports = pingCommand;
