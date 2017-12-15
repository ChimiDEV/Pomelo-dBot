const logger = require('../lib/util/logger');

const sound = {
    'bitchdab': './sounds/bitchdab.mp3',
    'boom': './sounds/boom.mp3',
    'choppa': './sounds/choppa.mp3',
    'cunt': './sounds/cunt.mp3',
    'damnson': './sounds/damnson.mp3',
    'danger-friendzone': './sounds/danger-friendzone.mp3',
    'danger-hisname': './sounds/hisnameis.mp3',
    'danger-moan': './sounds/danger-moan.mp3',
    'danger-oncetoldme': './sounds/danger-oncetoldme.mp3',
    'doit': './sounds/doit.mp3',
    'dontgiveit': './sounds/dontgiveit.mp3',
    'familiarfaces': './sounds/familiarfaces.mp3',
    'fuckthis': './sounds/fuckthis.mp3',
    'gameover': './sounds/gameover.mp3',
    'getcamera': './sounds/camera.avi',
    'getout': './sounds/getout.mp3',
    'headshot': './sounds/headshot.mp3',
    'hefucked': './sounds/hefucked.mp3',
    'hellodarkness': './sounds/hellodarkness.mp3',
    'hoodini': './sounds/hoodini.mp3',
    'howcouldthishappen': './sounds/howcouldthishappen.mp3',
    'illuminati': './sounds/illuminati.mp3',
    'jeff': './sounds/jeff.mp3',
    'jesus': './sounds/jesus.mp3',
    'lying': './sounds/lying.mp3',
    'merica': './sounds/merica.mp3',
    'moan': './sounds/moan.mp3',
    'money': './sounds/money.mp3',
    'movebitch': './sounds/movebitch.mp3',
    'niggagay': './sounds/niggagay.mp3',
    'notime': './sounds/notime.mp3',
    'oncetoldme': './sounds/oncetoldme.mp3',
    'realslimshady': './sounds/slimshady-standup.mp3',
    'retardlaugh': './sounds/retardlaugh.mp3',
    'rewind': './sounds/rewind.mp3',
    'runbitch': './sounds/runbitch.mp3',
    'sadviolinmlg': './sounds/sadviolinmlg.mp3',
    'silence': './sounds/grille.mp3',
    'slimshady': './sounds/chikachika.mp3',
    'sneaky': './sounds/sneaky.mp3',
    'sometrump': './sounds/sometrump.mp3',
    'theone': './sounds/theone.mp3',
    'theoneandonly': './sounds/theoneandonly.mp3',
    'thuglife': './sounds/thuglife.mp3',
    'thuglife2': './sounds/thuglife2.mp3',
    'tripple': './sounds/tripple.mp3',
    'trump': './sounds/trump.mp3',
    'trumpet': './sounds/trumpet.mp3',
    'watchasay': './sounds/say.avi',
    'whatarethose': './sounds/whatarethose.mp3',
    'whocares': './sounds/whocares.mp3',
    'wombocombo': './sounds/wombo.avi',
    'skrrr': './sounds/skrrr.mp3',
    'wasted': './sounds/wasted.mp3',
    'smash': './sounds/smash.mp3',
    'sumfak': './sounds/sumfak.mp3',
    'benisahoe': './sounds/benisahoe.mp3',

    'dontunderstand': './sounds/dontunderstand.mp3',
    'disappointed': './sounds/disappointed.mp3',
    'drums': './sounds/drums.mp3',
    'kiss': './sounds/kiss.mp3',
    '911': './sounds/911.mp3',
    'twoshots': './sounds/twoshots.mp3',
    'profanity': './sounds/profanity.mp3',
    'mom420': './sounds/mom420.mp3',
    'its420': './sounds/its420.mp3',
    'dontsayswears': './sounds/dontsayswears.mp3',
    'beer': './sounds/beer.mp3',
    'shieet': './sounds/shieet.mp3',
    'stillloveyou': './sounds/stillloveyou.mp3',
    'thetinggoes': './sounds/thetinggoes.mp3'
}


const soundCommand = {
    name: 'sound',
    module: {
        usage: '<Sound>',    
        description: () => {
            let str = 'Currently available sounds:\n';
            Object.getOwnPropertyNames(sound).forEach(soundName => {
                str += `\t\t${soundName}\n`;
            });
            return str;
        },
        process: (client, msg, suffix) => {
            let soundName = suffix != '' ? suffix : null;
            if (!soundName || !sound[soundName]) {
                msg.channel.send('No sound defined')
            }

            const voiceConnection = client.voiceConnections.get(msg.guild.id);

            new Promise((resolve, reject) => {
                if (!voiceConnection) {
                    // Bot is currently not in a voice channel
                    // Use voice channel of user
                    let voiceChannel = getAuthorVoiceChannel(msg);
                    if (voiceChannel) {
                        voiceChannel.join().then(connection => {
                            resolve(connection);
                        }, err => {
                            logger.err(err, 'SoundBoard');
                        });
                    } else {
                        reject('No voice channel found.')
                    }
                } else {
                    resolve(voiceConnection);
                }
            })
            .then(connection => {
                const audio = sound[soundName];        
                const dispatcher = connection.playFile(audio);
            }, err => {
                logger.err(err, 'SoundBoard');
                msg.channel.send(err);
            });
        }
    }
}

function getAuthorVoiceChannel(msg) {
    var voiceChannelArray = msg.guild.channels.filter((v) => v.type == 'voice').filter((v) => v.members.has(msg.author.id)).array();
    if (voiceChannelArray.length == 0) return null;
    else return voiceChannelArray[0];
}

module.exports = soundCommand;