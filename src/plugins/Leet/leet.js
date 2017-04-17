var leet = require('leet');

/* Command: Leet */
exports.leet = {
    usage: "<Message>",
    description: "Its 1337 o'cl0ck",
    process: leetIt
}

function leetIt(bot, msg, suffix) {
    msg.channel.sendMessage(leet.convert(suffix));
}
/* --- */

exports.commands = [
    "leet"
]
