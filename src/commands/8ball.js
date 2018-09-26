const Command = require('../lib/Command');
const responses = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  'Don\'t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
  'No.',
  'Nah.',
  'That\'s a negative.',
  'Not gonna happen.',
  'I don\'t think so.',
  'No, sorry',
  'Lol fuck no.',
  'Hell yes.',
  'Maybe.'
]

const ballCommand = new Command({
  name: 'Magic 8-Ball',
  triggers: [
    '🎱', '8ball'
  ],
  description: 'Use the magic 8-Ball for fortune-telling or if you are seeking advice.',
  usage: '<question>',
  missingArgs: {
    embed: {
      color: 0x191919,
      author: {
        name: 'Magic 🎱'
      },
      description: `**\`You forgot the question.\`**`
    }
  },
  process(client, msg, args) {
    let question = args.join(' ');
    if (question.slice(-1) === '.' || question.slice(-1) === '!') 
      question = question.slice(0, -1) + '?';
    if (question.slice(-1) !== '?') 
      question += '?';
    return msg
      .channel
      .send({
        embed: {
          color: 0x191919,
          author: {
            name: 'Magic 🎱'
          },
          description: `_\"Ooooh magical 8-Ball... ${question}\"\n\n_ **\`${responses[Math.floor(responses.length * Math.random())]}\`**`,
          thumbnail: {
            url: 'http://www.reactiongifs.com/r/mgc.gif'
          }
        }
      });
  }
});

module.exports = ballCommand;
