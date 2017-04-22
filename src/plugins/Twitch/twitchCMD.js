const twitchApi = require('twitch-api');

var twitch = new twitchApi({
    clientId: AuthDetails.twitch_client_id,
    clientSecret: AuthDetails.twitch_client_secret,
    redirectUri: 'http://localhost'
});

const twitchCmd = [
    'topGames'
    'game'
]

const gameAlias = {
    "csgo": "Counter-Strike: Global Offensive"
}

/* Command: Twitch */
exports.twitch = {
    usage: '<Twitch Command> "Argument"',
    description: function() {
        var str = 'Available Commands:\n'
        for (var c in twitchCmd) {
            str += '\t\t' + c + '\n'
        }
        return str;
    },
    process: twitchFunction
}

function twitchFunction(bot, msg, suffix) {
    var args = msg.content.split('"')[1];
    var cmd = string.split(' ')[1];

    cmd = twitchCmd[cmd];
    args = gameAlias[args] ? gameAlias[args] : args;

    if (!cmd) {
        msg.channels.sendMessage('Missing or invalid twitch command');
        return;
    }

    switch (cmd) {
        case "topGames":
            twitchTopGames(msg)
            break;
        case "game":
            twitchGame(msg, args)
            break;
        case "esports":
            break;
        default:
            return;
    }
}
/* --- */

function twitchTopGames(msg) {
    twitch.getTopGames({
        limit: 3
    }, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        var topGame = res.top;
        var msgText = ""

        for (var g in topGame) {
            var gameName = topGame[g].game.name;
            var gameViewers = topGame[g].viewers;
            var gameUrl = "https://www.twitch.tv/directory/game/" + encodeURI(gameName);
            var rank = parseInt(g) + 1;

            msgText += rank + ". **" + gameName + "** with " + gameViewers + " Viewers\n" +
                gameUrl + "\n";
        }
        notifyChannel.sendMessage(msgText);
    });
}

function twitchGame(msg, game) {
    if(!game) {
        msg.channels.sendMessage("No Game given");
        return;
    }
    
    twitch.getStreams({
        game: game,
        limit: 1
    }, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
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
}

exports.commands = [
    'twitch'
]
