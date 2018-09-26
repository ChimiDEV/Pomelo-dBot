const Command = require('../lib/Command');

const weebCommand = new Command({
  name: 'Weeb Speak',
  triggers: ['weeb', 'weebify', '⛩'],
  usage: '<text>',
  description: 'Make the bot speak animu language',
  missingArgs: 'what do you nyeed ^w^',
  process(client, msg, args) {
    let faces = ['(・`ω´・)', ';w;', 'owo', 'UwU', '>w<', '^w^']
    let weebMsg = args.join(' ')
    weebMsg = weebMsg.replace(/(?:r|l)/g, 'w')
    weebMsg = weebMsg.replace(/(?:R|L)/g, 'W')
    weebMsg = weebMsg.replace(/n([aeiou])/g, 'ny$1')
    weebMsg = weebMsg.replace(/N([aeiou])/g, 'Ny$1')
    weebMsg = weebMsg.replace(/N([AEIOU])/g, 'Ny$1')
    weebMsg = weebMsg.replace(/ove/g, 'uv')
    weebMsg = weebMsg.replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `);

    msg.channel.send(weebMsg);
  }
});

module.exports = weebCommand;