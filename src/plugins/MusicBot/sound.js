const request = require('request');
const youtubedl = require('youtube-dl');

const sound = {
    "bitchdab": "./plugins/MusicBot/sounds/bitchdab.mp3",
    "boom": "./plugins/MusicBot/sounds/boom.mp3",
    "choppa": "./plugins/MusicBot/sounds/choppa.mp3",
    "cunt": "./plugins/MusicBot/sounds/cunt.mp3",
    "damnson": "./plugins/MusicBot/sounds/damnson.mp3",
    "danger-friendzone": "./plugins/MusicBot/sounds/danger-friendzone.mp3",
    "danger-hisname": "./plugins/MusicBot/sounds/hisnameis.mp3",
    "danger-moan": "./plugins/MusicBot/sounds/danger-moan.mp3",
    "danger-oncetoldme": "./plugins/MusicBot/sounds/danger-oncetoldme.mp3",
    "doit": "./plugins/MusicBot/sounds/doit.mp3",
    "dontgiveit": "./plugins/MusicBot/sounds/dontgiveit.mp3",
    "drop1": "https://www.youtube.com/watch?v=hyVZNsYxb0Q",
    "familiarfaces": "./plugins/MusicBot/sounds/familiarfaces.mp3",
    "fuckthis": "./plugins/MusicBot/sounds/fuckthis.mp3",
    "gameover": "./plugins/MusicBot/sounds/gameover.mp3",
    "getcamera": "./plugins/MusicBot/sounds/camera.avi",
    "getout": "./plugins/MusicBot/sounds/getout.mp3",
    "headshot": "./plugins/MusicBot/sounds/headshot.mp3",
    "hefucked": "./plugins/MusicBot/sounds/hefucked.mp3",
    "hellodarkness": "./plugins/MusicBot/sounds/hellodarkness.mp3",
    "hoodini": "./plugins/MusicBot/sounds/hoodini.mp3",
    "howcouldthishappen": "./plugins/MusicBot/sounds/howcouldthishappen.mp3",
    "illuminati": "./plugins/MusicBot/sounds/illuminati.mp3",
    "jeff": "./plugins/MusicBot/sounds/jeff.mp3",
    "jesus": "./plugins/MusicBot/sounds/jesus.mp3",
    "lying": "./plugins/MusicBot/sounds/lying.mp3",
    "merica": "./plugins/MusicBot/sounds/merica.mp3",
    "moan": "./plugins/MusicBot/sounds/moan.mp3",
    "money": "./plugins/MusicBot/sounds/money.mp3",
    "movebitch": "./plugins/MusicBot/sounds/movebitch.mp3",
    "niggagay": "./plugins/MusicBot/sounds/niggagay.mp3",
    "notime": "./plugins/MusicBot/sounds/notime.mp3",
    "oncetoldme": "./plugins/MusicBot/sounds/oncetoldme.mp3",
    "realslimshady": "./plugins/MusicBot/sounds/slimshady-standup.mp3",
    "retardlaugh": "./plugins/MusicBot/sounds/retardlaugh.mp3",
    "rewind": "./plugins/MusicBot/sounds/rewind.mp3",
    "runbitch": "./plugins/MusicBot/sounds/runbitch.mp3",
    "sadviolinmlg": "./plugins/MusicBot/sounds/sadviolinmlg.mp3",
    "silence": "./plugins/MusicBot/sounds/grille.mp3",
    "slimshady": "./plugins/MusicBot/sounds/chikachika.mp3",
    "smokeweed": "https://www.youtube.com/watch?v=QsTPtWvA3tc",
    "sneaky": "./plugins/MusicBot/sounds/sneaky.mp3",
    "sometrump": "./plugins/MusicBot/sounds/sometrump.mp3",
    "starwarscanteen": "https://www.youtube.com/watch?v=xiceLdfHmYc",
    "theone": "./plugins/MusicBot/sounds/theone.mp3",
    "theoneandonly": "./plugins/MusicBot/sounds/theoneandonly.mp3",
    "thuglife": "./plugins/MusicBot/sounds/thuglife.mp3",
    "thuglife2": "./plugins/MusicBot/sounds/thuglife2.mp3",
    "tripple": "./plugins/MusicBot/sounds/tripple.mp3",
    "trump": "./plugins/MusicBot/sounds/trump.mp3",
    "trumpet": "./plugins/MusicBot/sounds/trumpet.mp3",
    "watchasay": "./plugins/MusicBot/sounds/say.avi",
    "whatarethose": "./plugins/MusicBot/sounds/whatarethose.mp3",
    "whocares": "./plugins/MusicBot/sounds/whocares.mp3",
    "wombocombo": "./plugins/MusicBot/sounds/wombo.avi",
    "skrrr": "./plugins/MusicBot/sounds/skrrr.mp3",
    "wasted": "./plugins/MusicBot/sounds/wasted.mp3",
    "smash": "./plugins/MusicBot/sounds/smash.mp3",
    "sumfak": "./plugins/MusicBot/sounds/sumfak.mp3",
    "benisahoe": "./plugins/MusicBot/sounds/benisahoe.mp3",

    "dontunderstand": "./plugins/MusicBot/sounds/dontunderstand.mp3",
    "disappointed": "./plugins/MusicBot/sounds/disappointed.mp3",
    "drums": "./plugins/MusicBot/sounds/drums.mp3",
    "kiss": "./plugins/MusicBot/sounds/kiss.mp3",
    "911": "./plugins/MusicBot/sounds/911.mp3",
    "twoshots": "./plugins/MusicBot/sounds/twoshots.mp3",
    "profanity": "./plugins/MusicBot/sounds/profanity.mp3",
    "mom420": "./plugins/MusicBot/sounds/mom420.mp3",
    "its420": "./plugins/MusicBot/sounds/its420.mp3",
    "dontsayswears": "./plugins/MusicBot/sounds/dontsayswears.mp3",
    "beer": "./plugins/MusicBot/sounds/beer.mp3",
    "shieet": "./plugins/MusicBot/sounds/shieet.mp3",
    "stillloveyou": "./plugins/MusicBot/sounds/stillloveyou.mp3",
    "thetinggoes": "./plugins/MusicBot/sounds/thetinggoes.mp3"
}

/* Command: Play Song of Youtube */
exports.play = {
    usage: "<Youtube Link>",
    description: "Play sound of a Youtube video",
    process: playSound
}

function playSound(bot, msg, suffix) {
    if (!(suffix.toLowerCase().startsWith('http')) || !(suffix.toLowerCase().startsWith('https'))) {
        msg.channel.send("No Youtube link defined.");
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
        msg.channel.send(err);
    });
}
/* --- */

/* Command: Sounboard */
exports.sound = {
    usage: "<Sound>",
    description: function () {
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
    if (!soundType || !(sound[soundType])) {
        msg.channel.send("No sound defined");
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

        const broadcast = bot.createVoiceBroadcast();
        const audio = sound[soundType];
        broadcast.playFile(audio);
        client.voiceConnections.values().forEach(connection => {
            const dispatcher = connection.playBroadcast(broadcast);
            dispatcher.on("end", end => {
                // Leave the voice channel.
                if (connection != null) {
                    connection.channel.leave();
                    return;
                }
        });

        /*var audio;
          var dispatcher;

          // Check if it is a youtube link or a file
          if (sound[soundType].startsWith("https")) {
              audio = youtubedl(sound[soundType]);
              dispatcher = connection.playStream(audio);
          } else {
              audio = sound[soundType];
              dispatcher = connection.playFile(audio);
          }
          connection.player.dispatcher.setVolume(0.25);

          dispatcher.on("end", end => {
              // Leave the voice channel.
              if (connection != null) {
                  connection.player.dispatcher.end();
                  connection.channel.leave();
                  return;
              }
          });*/
    }, err => {
        console.log(err);
        msg.channel.send(err);
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