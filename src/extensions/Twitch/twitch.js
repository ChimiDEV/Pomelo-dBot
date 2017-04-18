const AuthDetails = require('../../auth.json');
const twitchApi = require('twitch-api');
const qs = require('querystring');

var twitch = new twitchApi({
    clientId: AuthDetails.twitch_client_id,
    clientSecret: AuthDetails.twitch_client_secret,
    redirectUri: 'http://localhost'
});

exports.notifier = function(bot) {
    var notifyChannel = bot.channels.find("name", "test");

    twitch.getStreams ({game: "Counter-Strike: Global Offensive", limit: 1}, (err, res) => {
        var stream = res.streams[0].channel
        var streamTitle = stream.status;
        var streamGame = stream.game;
        var streamLang = stream.language.toUpperCase();
        var streamViewers = stream.views;
        var streamUser = stream.display_name;
        var streamUrl = stream.url;

        var msgTxt = "_" + streamGame + "_\n" +
                    "**[" + streamLang + "] " + streamTitle + "** \n" +
                    "Viewer: " + streamViewers + "\n" +
                    "Streamer: " + streamUser + "\n" +
                    streamUrl;


        console.log(msgTxt);
    });

    /* setInterval(() => {
        notifyChannel.sendMessage("test");
    }, 1000 * 20) */
}
