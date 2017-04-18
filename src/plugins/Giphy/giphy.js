const request = require("request");
const qs = require("querystring");

/* Command: Giphy */
var giphyOptions = {
    "apiKey": "dc6zaTOxFJmzC",
    "rating": "r",
    "url": "http://api.giphy.com/v1/gifs/random",
    "permission": ["NORMAL"]
}

exports.giphy = {
    usage: "<Image Tags>",
    description: "Returns a random GIF from Giphy matching the tags (If no tags given, random GIF is posted)",
    process: giphyFunction
}

function giphyFunction(bot, msg, suffix) {
    if (suffix.length > 1) {
        var tags = suffix.split(" ");
    } else {
        var tags = null;
    }

    getGif(tags, (id) => {
        if (typeof id !== "undefined") {
            msg.channel.sendMessage("http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
        } else {
            msg.channel.sendMessage("Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
        }
    });
}


function getGif(tags, callback) {
    var options = {
        "api_key": giphyOptions.apiKey,
        "rating": giphyOptions.rating,
        "format": "json",
        "limit": 1
    }

    var query = qs.stringify(options);

    if (tags !== null) {
        query += "&tag=" + tags.join('+');
    }

    request(giphyOptions.url + "?" + query, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            console.log("Giphy: Found Error " + body);
            console.log(err);
        } else {
            try {
                var responseObj = JSON.parse(body)
                callback(responseObj.data.id);
            } catch (e) {
                callback(undefined);
            }
        }

    }.bind(this));
}
/* --- */

exports.commands = [
    "giphy"
]
