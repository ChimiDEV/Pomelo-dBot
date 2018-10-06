const ytdl = require('ytdl-core');
const ytSearch = require('youtube-search');
const Command = require('../lib/Command');

const playCommand = new Command({
	name: 'Play Youtube',
	triggers: ['play', 'yt'],
	description: 'Play music or a sound from Youtube',
	usage: '<yt url or search term>',
	async process(client, msg, args) {
		let ytURL;
		if (args[0].includes('https') && args[0].includes('https')) {
			ytURL = args[0];
			playSound(client, msg, ytURL);
		} else {
			// Search Youtube
			const options = {
				maxResults: 1,
				key: client._authDetails.youtubeKey
			};
			ytSearch(args.join(' '), options, (err, results) => {
				if (err) {
					client._logger.err(err, 'Play');
					return msg.channel.send('Error while searching youtube');
				}
				let ytData = results[0];
				playSound(client, msg, results[0].link);
				const embed = {
					title: ytData.title,
					url: ytData.link,
					color: 0xd23232,
					author: {
						name: ytData.channelTitle,
						icon_url:
							'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/71px-YouTube_full-color_icon_%282017%29.svg.png'
					},
					thumbnail: {
						url: ytData.thumbnails.medium.url
					}
				};
				return msg.channel.send(`🔥 ${msg.author} I've found a matching youtube video for you 🔥`, { embed });
			});
		}
	},
	missingArgs: 'Missing Youtube URL.'
});

async function playSound(client, msg, ytURL) {
	let voiceConnection;
	try {
		voiceConnection = await resolveVoiceConnection(client, msg);
	} catch (error) {
		client._logger.err(error, 'Play');
		return msg.channel.send(error);
	}

	if (voiceConnection.dispatcher) {
		logger.debug('Sound already playing');
		return;
	}
	voiceConnection.playStream(ytdl(ytURL, { filter: 'audioonly' }));
}

function resolveVoiceConnection(client, msg) {
	const voiceConnection = client.voiceConnections.get(msg.guild.id);

	if (!voiceConnection) {
		let voiceChannel = getAuthorVoiceChannel(msg);
		if (voiceChannel) {
			voiceChannel
				.join()
				.then(connection => Promise.resolve(connection), err => Promise.reject(err));
		} else {
			return Promise.reject('No voice channel found.');
		}
	} else {
		return Promise.resolve(voiceConnection);
	}
}

function getAuthorVoiceChannel(msg) {
	var voiceChannelArray = msg.guild.channels
		.filter(v => v.type == 'voice')
		.filter(v => v.members.has(msg.author.id))
		.array();
	if (voiceChannelArray.length === 0) return null;
	else return voiceChannelArray[0];
}

module.exports = playCommand;
