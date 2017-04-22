const twitchApi = require('twitch-api');
const AuthDetails = require('../../auth.json');

var twitch = new twitchApi({
    clientId: AuthDetails.twitch_client_id,
    clientSecret: AuthDetails.twitch_client_secret,
    redirectUri: 'http://localhost'
});

const twitchCmd = [
    'topGames',
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
            str += '\t\t' + twitchCmd[c] + '\n'
        }
        return str;
    },
    process: twitchFunction
}

function twitchFunction(bot, msg, suffix) {
    var args = msg.content.split('"')[1];
    var cmd = msg.content.split(' ')[1];

    args = gameAlias[args] ? gameAlias[args] : args;

    if (!cmd) {
        msg.channel.sendMessage('Missing twitch command');
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
            msg.channel.sendMessage('Invalid twitch command');
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
        var msgTxt = ""

        for (var g in topGame) {
            var gameName = topGame[g].game.name;
            var gameViewers = topGame[g].viewers;
            var gameUrl = "https://www.twitch.tv/directory/game/" + encodeURI(gameName);
            var rank = parseInt(g) + 1;

            msgTxt += rank + ". **" + gameName + "** with " + gameViewers + " Viewers\n" +
                gameUrl + "\n";
        }

        if(msgTxt.length < 1) {
            msgTxt = "No top Games found."
        }
        msg.channel.sendMessage(msgTxt);
    });
}

function twitchGame(msg, game) {
    if(!game) {
        msg.channel.sendMessage("No Game given");
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

        msg.channel.sendMessage(msgTxt)
    });
}

exports.commands = [
    'twitch'
]
