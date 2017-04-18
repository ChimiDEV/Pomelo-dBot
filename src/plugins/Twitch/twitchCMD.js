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
            twitchGame(msg)
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

function twitchGame(msg) {
    twitch
}

exports.commands = [
    'twitch'
]
