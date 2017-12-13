const request = require('request');
const urbanApi = require('urban');

/* Command: Random Math Fact */
exports.mathFact = {
    description: 'Gives a random math fact',
    process: mathFactFunction
}

function mathFactFunction(bot, msg, suffix) {
    request('http://numbersapi.com/random/math?json', (err, res, body) => {
        var data = JSON.parse(body);
        if (data && data.text) {
            msg.channel.send(data.text)
        }
    });
}
/* --- */

/* Command: Random Urban Directory Fact */
exports.urban = {
    description: 'Returns random definition or a given term',
    usage: '<Term to define>',
    process: urbanFunction
}

function urbanFunction(bot, msg, suffix) {
    var targetWord = suffix == '' ? urbanApi.random() : urbanApi(suffix);
    targetWord.first(json => {
        if (json) {
            var message = 'Urban Dictionary: **' + json.word + '**\n\n' + json.definition;
            if (json.example) {
                message = message + '\n\n__Example__:\n' + json.example;
            }
            msg.channel.send(message);
        } else {
            msg.channel.send('No matches found.');
        }
    });
}
/* --- */

exports.commands = [
    'mathFact',
    'urban'
];
