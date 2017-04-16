var request = require('request');
var urbanApi = require('urban');

/* Command: Random Math Fact */
exports.mathFact = {
    description: "Gives a random math fact",
    process: mathFactFunction
}

function mathFactFunction(bot, msg, suffix) {
    request('http://numbersapi.com/random/math?json', function (err, res, body) {
        var data = JSON.parse(body);
        if (data && data.text) {
            msg.channel.sendMessage(data.text)
        }
    });
}
/* --- */

/* Command: Random Urban Directory Fact */
exports.urban = {
    description: "Returns random definition or a given term",
    usage: "<Term to define>",
    process: urbanDirectoryFunction
}

function urbanFunction(bot, msg, suffix) {
    var targetWord = suffix == "" ? urban.random() : urban(suffix);
    if(suffix.length > 0) {
        var query = encodeURIComponent(suffix);
        console.log(query);
    } else {
        request("www.urbandictionary.com/random.php", function (err, res, body) {
            console.log(body);
        });
        
        //msg.channel.sendMessage()
    }
}



exports.commands = [
    "mathFact",
    "urban"
];