const AuthDetails = require('../../auth.json');
const Imgflipper = require('imgflipper');

const meme = {
    "onedoesnot": 61579,
    "batslap": 438680,
    "idontalways": 61532,
    "notsureif": 61520,
    "everywhere": 347390,
    "firstworldproblem": 61539,
    "waiting": 4087833,
    "braceyourselves": 61546,
    "badluck": 61585,
    "noneofmybusiness": 16464531,
    "yuno": 61527,
    "doge": 8072285,
    "facepalm": 1509839,
    "successkid": 61544,
    "yougeta": 28251713,
    "grumpy": 405658,
    "yallgotmore": 13424299,
    "wat": 14230520,
    "awkwardseal": 13757816,
    "badpun": 12403754,
    "anditsgone": 766986,
    "realmvp": 15878567,
    "confusedgandalf": 673439,
    "spidermandesk": 1366993,
    "blackadvice": 93035738
}

/* Command: Meme Creator */
exports.meme = {
    usage: 'meme \"top text\" \"bottom text\"',
    description: function() {
        var str = 'Currently available memes:\n'
        for (var m in meme) {
            str += "\t\t" + m + "\n"
        }
        return str;
    },
    process: memeGenerator
};

function memeGenerator(bot, msg, suffix) {
    var memeText = msg.content.split('"');
    var memeType = memeText[0].split(' ')[1];

    var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password);

    imgflipper.generateMeme(meme[memeType], memeText[1] ? memeText[1] : '', memeText[3] ? memeText[3] : '', (err, img) => {
        if (img) {
            msg.channel.sendMessage(img);
        } else {
            msg.channel.sendMessage('No valid Arguments');
        }
    });
}

exports.commands = [
    "meme"
]
