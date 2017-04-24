const AuthDetails = require('../../auth.json');
const Config = require('../../config.json');
const twitchApi = require('twitch-api');
const qs = require('querystring');
const _ = require('lodash');


var twitch = new twitchApi({
    clientId: AuthDetails.twitch_client_id,
    clientSecret: AuthDetails.twitch_client_secret,
    redirectUri: 'http://localhost'
});

var notifyStream = Config.twitchNotify;

var isOnline = {}

exports.notifier = function(bot) {
    var notifyChannel = bot.channels.find("name", Config.textChannel);
    // Initialize
    checkOnlineState(notifyChannel);


    setInterval(() => {
        checkOnlineState(notifyChannel);
    }, 1000 * 20)
}

/*
 * Deprecated: Found better way to check online state
function checkOnlineState(channel, index) {
    // Current Twitch Channel
    var currChannel = notifyStream[index];
    if (!currChannel) {
        return;
    }
    twitch.getChannelStream(currChannel, (err, res) => {
        if (err) {
            console.log(err);
        }
        stream = res.stream;

        if (!stream) {
            // Stream is (now) offline
            isOnline[currChannel] = false;
        } else if (stream && !(isOnline[currChannel])) {
            // Is now online -> Notify in Channel
            console.log(currChannel + " is now online@" + stream.channel.url);
            channel.sendMessage(currChannel + "is now online@" + stream.channel.url);
            isOnline[currChannel] = true;
        } else {
            // Was already online
            isOnline[currChannel] = true;
        }
        index++
        checkOnlineState(channel, index);
    });
}
*/

function checkOnlineState(channel) {
    var streamList = notifyStream.join(",");
    twitch.getStreams({
        channel: streamList
    }, (err, res) => {
        if(typeof res.streams == 'undefined') return; // Handle if no stream is found
        streams = res.streams
        if (streams.length >= 1) {
            // Check online streams and notify on newcomer
            var activeStreamer = [];
            for (var i in streams) {
                var currChannel = streams[i].channel;
                var currGame = streams[i].game;
                var userChannel = currChannel.name;
                var displayingName = currChannel.display_name;
                var statusChannel = currChannel.status;

                activeStreamer.push(streams[i].channel.name);

                if(!(isOnline[userChannel])) {
                    // Was offline -> Now online
                    channel.sendMessage("**" + displayingName + "** is now online playing \n" + currGame + "@_" + statusChannel + "_ \n"
                                        + currChannel.url);
                }
                isOnline[userChannel] = true;
            }
            // Find offline streams and update streamer status
            var offlineStreamer = _.difference(notifyStream, activeStreamer);
            for(var j in offlineStreamer) {
                var userChannel = offlineStreamer[j];
                isOnline[userChannel] = false;
            }
        }
    });
}
