const AuthDetails = require('../../auth.json');
var twitchApi = require('twitch-api');

var twitch = new twitchApi({
    clientId: AuthDetails.twitch_client_id,
    clientSecret: AuthDetails.twitch_client_secret,
    redirectUri: 'http://localhost'
});

exports.notifier = function(bot) {
    var notifyChannel = bot.channels.find("name", "test")

    console.log(twitch.getTopGames());

    setInterval(() => {
        notifyChannel.sendMessage("test");
    }, 1000 * 20)
}
