const Command = require('../lib/Command');

const clapCommand = new Command({
	name: 'Clap',
	triggers: ['clap', 'clapify', '👏'],
	description: 'Make your text said with more sass.',
  usage: '<text>',
  missingArgs: 'Can\'t clapify, if there is nothing to clapify'.split(' ').join(' 👏 '),
	process(client, message, args) {
		if (args.join(' ').length > 666) {
			return message.channel.send('Keep it short boi'.split(' ').join(' 👏 '));
    }
    
    if(args.length === 1) {
      message.channel.send(args[0].split('').join(' 👏 '));
    } else {
      message.channel.send(args.join(' 👏 '));
    }
	}
});

module.exports = clapCommand;
