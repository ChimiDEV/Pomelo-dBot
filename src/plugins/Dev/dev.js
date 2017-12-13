const request = require('request');

/* Command: Source Code */
exports.src = {
    description: 'Returns URL to source code on GitHub',
    process: srcFunction
}

function srcFunction(bot, msg, suffix) {
    var options = {
        url: 'https://api.github.com/repos/ChimiDEV/Pomelo-dBot',
        headers: {
            'User-Agent': 'node.js'
        }
    }
    request(options, (err, res, body) => {
        var repo = JSON.parse(body);
        if (repo) {
            var msgTxt = "_Pomelo Discord Bot_ by **" + repo.owner.login + "** \n" +
                repo.html_url;
            msg.channel.send(msgTxt);
        }
    });
}
/* --- */

/* Command: Set Game */
exports.setGame = {
    usage: '<Game Title>',
    description: 'Sets a Game for Bot',
    process: setGameFunction
}

function setGameFunction(bot, msg, suffix) {
    bot.user.setGame(suffix);
}
/* --- */

exports.commands = [
    'src',
    'setGame'
]
