const request = require('request');
const Command = require('../lib/Command');

const foodCommand = new Command({
  name: 'Foodporn Images',
  triggers: ['foodporn', 'food', '🥩'],
  description: 'Get some good looking food images provided by Reddit',
  async process(client, msg, args) {
    request('https://www.reddit.com/r/FoodPorn/top/.json?sort=top&t=day&limit=75', (req, res, body) => {
      const redditEntries = JSON.parse(body).data.children;
      const randomPost = redditEntries[Math.floor(76 * Math.random())].data
      msg.channel.send({
        embed: {
          color: 0xe0e0e0,
          author: {
            name: 'Foodporn',
            url: `https://www.reddit.com/${randomPost.permalink}`,
            icon_url: 'https://icon-icons.com/icons2/836/PNG/512/Reddit_icon-icons.com_66786.png'
          },
          title: `**${randomPost.title}**`,
          image: { url: randomPost.url },
        }
      })
    });

  }
});

module.exports = foodCommand;