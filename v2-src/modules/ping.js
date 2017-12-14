const pingCommand = {
    name: 'ping',
    module: {
        description: 'First command for testing purpose',
        process: (client, msg, suffix) => {
            msg.channel.send(msg.author + ' pong!');
            if (suffix) {
                msg.channel.send(' Note that !ping takes no arguments!');
            }
        }
    }
}


module.exports = pingCommand;