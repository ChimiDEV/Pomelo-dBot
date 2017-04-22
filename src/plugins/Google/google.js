const request = require('request');
const AuthDetails = require('../../auth.json');
const yt = require("./youtubePlugin");
const youtubePlugin = new yt();

/* Command: Image */
exports.image = {
    usage: '<Search Tags>',
    description: 'Gets the top matching image from Google',
    process: googleImage
}

function googleImage(bot, msg, suffix) {
    if (!AuthDetails || !AuthDetails.youtube_api_key || !AuthDetails.google_custom_search) {
        msg.channel.sendMessage("Image search requires both a YouTube API key and a Google Custom Search key!");
        return;
    }

    var page = 1;
    request("https://www.googleapis.com/customsearch/v1?key=" + AuthDetails.youtube_api_key + "&cx=" + AuthDetails.google_custom_search +
        "&q=" + (suffix.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start=" + page,
        (err, res, body) => {
            var data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                console.log(e);
            }

            if (!data) {
                msg.channel.sendMessage("Error: " + JSON.stringify(data));
                return;
            } else if (!data.items || data.items.length == 0) {
                msg.channel.sendMessage("No result for '" + suffix + "'");
                return;
            }
            var randResult = data.items[0];
            msg.channel.sendMessage(randResult.title + '\n' + randResult.link);
        });
}
/* --- */

/* Command: Random Image */
exports.rImage = {
    usage: '<Search Tags>',
    description: 'Gets a random matching image from Google',
    process: googleRandomImage
}

function googleRandomImage(bot, msg, suffix) {
    if (!AuthDetails || !AuthDetails.youtube_api_key || !AuthDetails.google_custom_search) {
        msg.channel.sendMessage("Image search requires both a YouTube API key and a Google Custom Search key!");
        return;
    }

    var page = 1 + Math.floor(Math.random() * 5) * 10; // Request 10 items
    request("https://www.googleapis.com/customsearch/v1?key=" + AuthDetails.youtube_api_key + "&cx=" + AuthDetails.google_custom_search +
        "&q=" + (suffix.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start=" + page,
        (err, res, body) => {
            var data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                console.log(e)
                return;
            }
            if (!data) {
                msg.channel.sendMessage("Error:\n" + JSON.stringify(data));
                return;
            } else if (!data.items || data.items.length == 0) {
                msg.channel.sendMessage("No result for '" + suffix + "'");
                return;
            }
            var randResult = data.items[Math.floor(Math.random() * data.items.length)];
            msg.channel.sendMessage(randResult.title + '\n' + randResult.link);
        });
}
/* --- */

/* Command: Random Google Gif */
exports.rGif = {
    usage: '<Search Tags>',
    description: 'Gets a random matching GIF from Google',
    process: googleRandomGif
}

function googleRandomGif(bot, msg, suffix) {
    var page = 1 + Math.floor(Math.random() * 5) * 10;
    request("https://www.googleapis.com/customsearch/v1?key=" + AuthDetails.youtube_api_key + "&cx=" + AuthDetails.google_custom_search +
        "&q=" + (suffix.replace(/\s/g, '+')) + "&searchType=image&alt=json&num=10&start=" + page + "&fileType=gif",
        (err, res, body) => {
            var data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                console.log(e)
                return;
            }
            if (!data) {
                msg.channel.sendMessage("Error:\n" + JSON.stringify(data));
                return;
            } else if (!data.items || data.items.length == 0) {
                msg.channel.sendMessage("No result for '" + suffix + "'");
                return;
            }
            var randResult = data.items[Math.floor(Math.random() * data.items.length)];
            msg.channel.sendMessage(randResult.title + '\n' + randResult.link);
        });

}
/* --- */

exports.youtube = {
    usage: "<Search Tags>",
    description: "Return Youtube video matching with the tags",
    process: youtubeFind
}

function youtubeFind(bot, msg, suffix) {
    youtubePlugin.respond(suffix, msg.channel, bot);
}

exports.commands = [
    "image",
    "rImage",
    "rGif",
    "youtube"
];
