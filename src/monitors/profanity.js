const Filter = require('bad-words');
const filter = new Filter();

// Listens to every message and checks if there is any profanity.
module.exports = async (client, message) => {
	if (filter.isProfane(message.content)) {
		message.channel.send(`${message.author} Watch ur profanity :rolling_eyes:`).then(() => {
			message.channel
				.awaitMessages(response => response.content.toLowerCase().includes('sorry'), {
					max: 1,
					time: 5000,
					errors: ['time']
				})
				.then(collected => {
          collected.first().react('👍');
				})
				.catch(() => {
					message.react('😠');
					message.react('😒');
					message.react('😔');
				});
		});
	}
};
