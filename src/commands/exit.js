const Command = require('../lib/Command');
const exitCommand = new Command({
	name: 'Exit',
	triggers: ['exit'],
	description: 'Command to log out bot.',
	process(client, msg, args) {
		process.exit(0);
	}
});

module.exports = exitCommand;
