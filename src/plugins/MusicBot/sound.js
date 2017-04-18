const request = require('request');
const youtubedl = require('youtube-dl');

const sound = {
    "bitchdab": "https://www.youtube.com/watch?v=SCQXlKXBgU8",
    "boom": "https://www.youtube.com/watch?v=Ag6Cm7w5ICU",
    "choppa": "https://www.youtube.com/watch?v=umBzgEDIJ5E",
    "cunt": "https://www.youtube.com/watch?v=OI_RGqaFTPw",
    "damnson": "https://www.youtube.com/watch?v=vzovMpji0T8",
    "danger-friendzone": "https://www.youtube.com/watch?v=RhzArIfe_Qs",
    "danger-moan": "https://www.youtube.com/watch?v=zezyuiwr4fs",
    "doit": "https://www.youtube.com/watch?v=kkAwJ2uYCXA",
    "dontgiveit": "https://www.youtube.com/watch?v=Opy8YmDKX2M",
    "drop1": "https://www.youtube.com/watch?v=hyVZNsYxb0Q",
    "familiarfaces": "https://www.youtube.com/watch?v=LB7014dH5lg",
    "fuckthis": "https://www.youtube.com/watch?v=7-7Vxqaq3K0",
    "gameover": "https://www.youtube.com/watch?v=560kW1TmyFc",
    "getout": "https://www.youtube.com/watch?v=SpmCv4xR9rA",
    "headshot": "https://www.youtube.com/watch?v=r8GGPKJBAJs",
    "hefucked": "https://www.youtube.com/watch?v=kpXwN57rRiA",
    "hellodarkness": "https://www.youtube.com/watch?v=SZmsjAu0jd0",
    "hoodini": "https://www.youtube.com/watch?v=c0ScEVWaDqE",
    "howcouldthishappen": "https://www.youtube.com/watch?v=25jKeJ28dSQ",
    "illuminati": "https://www.youtube.com/watch?v=wjoUKyY5NsY",
    "jeff": "https://www.youtube.com/watch?v=D8oR9htb0p0",
    "jesus": "https://www.youtube.com/watch?v=4c50rSnCwAA",
    "lying": "https://www.youtube.com/watch?v=6P6XKHo7pz4",
    "merica": "https://www.youtube.com/watch?v=zcibPH3kpCY",
    "moan": "https://youtu.be/iQMmmiuuXUk?t=14",
    "money": "https://www.youtube.com/watch?v=vcpmBYfvF_I",
    "movebitch": "https://www.youtube.com/watch?v=UvUEP341KmI",
    "niggagay": "https://www.youtube.com/watch?v=bPK5BQIi4zM",
    "notime": "https://www.youtube.com/watch?v=dk-OfU6UaQo",
    "retardlaugh": "https://www.youtube.com/watch?v=Iua_USjwNbQ",
    "rewind": "https://www.youtube.com/watch?v=K91pRSMM3GE",
    "runbitch": "https://www.youtube.com/watch?v=GYZkNdjV580",
    "sadviolinmlg": "https://www.youtube.com/watch?v=_htzhlPVJso",
    "silence": "https://www.youtube.com/watch?v=xxxyWUVwPgk",
    "smokeweed": "https://www.youtube.com/watch?v=QsTPtWvA3tc",
    "starwarscanteen": "https://www.youtube.com/watch?v=xiceLdfHmYc",
    "theone": "https://www.youtube.com/watch?v=Qa0pLkW300I",
    "thuglife": "https://www.youtube.com/watch?v=LnjXz3Z0aAg",
    "thuglife2": "https://www.youtube.com/watch?v=Bq4i_bLFU0Q",
    "tripple": "https://www.youtube.com/watch?v=cZm3_b29IB0",
    "trump": "https://www.youtube.com/watch?v=EJjp0jaIHgY",
    "whatarethose": "https://www.youtube.com/watch?v=n8gjJ-dhUcM",
    "whocares": "https://www.youtube.com/watch?v=DyzdWHAjD94"
}
/* Command: Play Song of Youtube */
exports.play = {
    usage: "<Youtube Link>",
    description: "Play sound of a Youtube video",
    process: playSound
}

function playSound(bot, msg, suffix) {
    if (!(suffix.toLowerCase().startsWith('http')) || !(suffix.toLowerCase().startsWith('https'))) {
        msg.channel.sendMessage("No Youtube link defined.");
        return;
    }

    // Join the voice channel if not already in one.
    const voiceConnection = bot.voiceConnections.get(msg.guild.id);

    new Promise((resolve, reject) => {
        if (voiceConnection == null) {
            var voiceChannel = getAuthorVoiceChannel(msg);
            if (voiceChannel != null) {
                voiceChannel.join().then(connection => {
                    resolve(connection);
                }, err => {
                    console.log(err);
                });
            } else {
                reject("No Voice Channel found.");
            }
        } else {
            resolve(voiceConnection);
        }
    }).then(connection => {
        var video = youtubedl(suffix)

        const dispatcher = connection.playStream(video);
        connection.player.dispatcher.setVolume(0.1);

        dispatcher.on('error', err => {
            console.log(err)
        });
        dispatcher.on("end", end => {
            // Leave the voice channel.
            if (connection != null) {
                connection.player.dispatcher.end();
                connection.channel.leave();
                return;
            }
        });
    }, err => {
        console.log(err);
        msg.channel.sendMessage(err);
    });
}
/* --- */

/* Command: Sounboard */
exports.sound = {
    usage: "<Sound>",
    description: function() {
        var str = 'Currently available sounds:\n'
        for (var s in sound) {
            str += "\t\t" + s + "\n"
        }
        return str;
    },
    process: soundBoard
}

function soundBoard(bot, msg, suffix) {
    var soundType = suffix != "" ? suffix : null;
    if (!soundType) {
        msg.channel.sendMessage("No sound defined");
        return;
    }
    // Join the voice channel if not already in one.
    const voiceConnection = bot.voiceConnections.get(msg.guild.id);

    new Promise((resolve, reject) => {
        if (voiceConnection == null) {
            var voiceChannel = getAuthorVoiceChannel(msg);
            if (voiceChannel != null) {
                voiceChannel.join().then(connection => {
                    resolve(connection);
                }, err => {
                    console.log(err);
                });
            } else {
                reject("No Voice Channel found.");
            }
        } else {
            resolve(voiceConnection);
        }
    }).then(connection => {
        var video = youtubedl(sound[soundType])

        const dispatcher = connection.playStream(video);
        connection.player.dispatcher.setVolume(0.25);

        dispatcher.on("end", end => {
            // Leave the voice channel.
            if (connection != null) {
                connection.player.dispatcher.end();
                connection.channel.leave();
                return;
            }
        });
    }, err => {
        console.log(err);
        msg.channel.sendMessage(err);
    });
}
/* --- */

function getAuthorVoiceChannel(msg) {
    var voiceChannelArray = msg.guild.channels.filter((v) => v.type == "voice").filter((v) => v.members.has(msg.author.id)).array();
    if (voiceChannelArray.length == 0) return null;
    else return voiceChannelArray[0];
}

exports.commands = [
    "play",
    "sound"
]
