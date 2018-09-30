const Command = require('../lib/Command');

const sound = {
	guteidee: './sounds/guteIdee.mp3',
	alia: './sounds/alia.mp3',
	'911': './sounds/911.mp3',
	beer: './sounds/beer.mp3',
	benisahoe: './sounds/benisahoe.mp3',
	bitchdab: './sounds/bitchdab.mp3',
	boom: './sounds/boom.mp3',
	choppa: './sounds/choppa.mp3',
	cunt: './sounds/cunt.mp3',
	damnson: './sounds/damnson.mp3',
	'danger-friendzone': './sounds/danger-friendzone.mp3',
	'danger-hisname': './sounds/hisnameis.mp3',
	'danger-moan': './sounds/danger-moan.mp3',
	'danger-oncetoldme': './sounds/danger-oncetoldme.mp3',
	disappointed: './sounds/disappointed.mp3',
	doit: './sounds/doit.mp3',
	dontgiveit: './sounds/dontgiveit.mp3',
	dontsayswears: './sounds/dontsayswears.mp3',
	dontunderstand: './sounds/dontunderstand.mp3',
	drums: './sounds/drums.mp3',
	familiarfaces: './sounds/familiarfaces.mp3',
	fuckthis: './sounds/fuckthis.mp3',
	gameover: './sounds/gameover.mp3',
	getcamera: './sounds/camera.avi',
	getout: './sounds/getout.mp3',
	headshot: './sounds/headshot.mp3',
	hefucked: './sounds/hefucked.mp3',
	hellodarkness: './sounds/hellodarkness.mp3',
	hoodini: './sounds/hoodini.mp3',
	howcouldthishappen: './sounds/howcouldthishappen.mp3',
	illuminati: './sounds/illuminati.mp3',
	its420: './sounds/its420.mp3',
	jeff: './sounds/jeff.mp3',
	jesus: './sounds/jesus.mp3',
	kiss: './sounds/kiss.mp3',
	lying: './sounds/lying.mp3',
	mambo9: './sounds/mambo9.mp3',
	merica: './sounds/merica.mp3',
	moan: './sounds/moan.mp3',
	mom420: './sounds/mom420.mp3',
	money: './sounds/money.mp3',
	movebitch: './sounds/movebitch.mp3',
	niggagay: './sounds/niggagay.mp3',
	notime: './sounds/notime.mp3',
	oncetoldme: './sounds/oncetoldme.mp3',
	profanity: './sounds/profanity.mp3',
	realslimshady: './sounds/slimshady-standup.mp3',
	retardlaugh: './sounds/retardlaugh.mp3',
	rewind: './sounds/rewind.mp3',
	runbitch: './sounds/runbitch.mp3',
	sadviolinmlg: './sounds/sadviolinmlg.mp3',
	shieet: './sounds/shieet.mp3',
	silence: './sounds/grille.mp3',
	skrrr: './sounds/skrrr.mp3',
	slimshady: './sounds/chikachika.mp3',
	smash: './sounds/smash.mp3',
	sneaky: './sounds/sneaky.mp3',
	sometrump: './sounds/sometrump.mp3',
	stillloveyou: './sounds/stillloveyou.mp3',
	sumfak: './sounds/sumfak.mp3',
	theone: './sounds/theone.mp3',
	theoneandonly: './sounds/theoneandonly.mp3',
	thetinggoes: './sounds/thetinggoes.mp3',
	thuglife: './sounds/thuglife.mp3',
	thuglife2: './sounds/thuglife2.mp3',
	tripple: './sounds/tripple.mp3',
	trump: './sounds/trump.mp3',
	trumpet: './sounds/trumpet.mp3',
	twoshots: './sounds/twoshots.mp3',
	wasted: './sounds/wasted.mp3',
	watchasay: './sounds/say.avi',
	whatarethose: './sounds/whatarethose.mp3',
	whocares: './sounds/whocares.mp3',
	wombocombo: './sounds/wombo.avi',

	saddespo: './sounds/saddespo.mp3',
	dropit: './sounds/dropit.mp3',
	litgetup: './sounds/litGetUp.mp3',
	litbestfriend: './sounds/litBestFriend.mp3',
	litrightnow: './sounds/litRightNow.mp3',
	elconnecto: './sounds/elconnecto.mp3',
	ussr: './sounds/nationalanthem.mp3',
	trapshot: './sounds/trapshot.mp3',
	jannikmoan: './sounds/jannikMoan.mp3'
};

const soundCommand = new Command({
	name: 'Soundboard',
	triggers: ['sound'],
	usage: '<sound>',
	description() {
		let str = 'Currently available sounds:';
		Object.keys(sound).forEach(soundName => {
			str += `\n\t\t${soundName}`;
		});
		return str;
	},
	async process(client, msg, args) {
		const logger = client._logger;
		let soundName = args[0] != '' ? args[0] : null;

		if (!soundName || !sound[soundName]) {
			if (soundName !== 'random') {
				return msg.channel.send('No sound defined');
			}
		}

		if (soundName === 'random') {
			const soundKeys = Object.keys(sound);
			soundName = soundKeys[(soundKeys.length * Math.random()) << 0];
			logger.debug(`Random Sound is ${soundName}`, 'Soundboard');
			msg.channel.send(`${msg.author} Random Sound: ${soundName}`);
		}

		let voiceConnection;
		try {
			voiceConnection = await resolveVoiceConnection(client, msg);
		} catch (error) {
			logger.err(err, 'Soundboard');
			return msg.channel.send(err);
		}

		const audio = sound[soundName];

		if (voiceConnection.dispatcher) {
			logger.debug('Sound already playing');
			return;
		}

		logger.debug(client._playing, 'Client Playing');

		const dispatcher = voiceConnection.playFile(audio);
		client._playing = true;

		client.setTimeout(() => {
			logger.debug('Ending Dispatcher', 'Soundboard');
			dispatcher.end();
		}, 25000);

		dispatcher.on('error', err => {
			logger.error(err, 'Soundboard')
		});
		dispatcher.on('end', () => {
			logger.debug('Dispatcher end', 'Soundboard');
			client._playing = false;
		});
	}
});

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

module.exports = soundCommand;
