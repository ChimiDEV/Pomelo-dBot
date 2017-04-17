var util = require('util');
var youtubeNode = require('youtube-node');
var AuthDetails = require("../../auth.json");


function YoutubePlugin() {
    this.RickrollUrl = 'http://www.youtube.com/watch?v=oHg5SJYRHA0';
    this.youtube = new youtubeNode();
    this.youtube.setKey(AuthDetails.youtube_api_key);
    this.youtube.addParam('type', 'video');
};


YoutubePlugin.prototype.respond = function(query, channel, bot) {
    this.youtube.search(query, 1, function(error, result) {
        if (error) {
            channel.sendMessage("¯\\_(ツ)_/¯");
        } else {
            if (!result || !result.items || result.items.length < 1) {
                channel.sendMessage(YoutubePlugin.RickrollUrl);
            } else {
                channel.sendMessage("http://www.youtube.com/watch?v=" + result.items[0].id.videoId);
            }
        }
    });
};


module.exports = YoutubePlugin;
