const fs = require('fs')
const logger = require('./lib/util/logger');

// load all commands in an object
module.exports = () => {
    let cmds = {};

    let files = fs.readdirSync('./src/commands');

    files.forEach(command => {
        let cmd = require(`./commands/${command}`);
        logger.debug(cmd.module, `Load command - ${cmd.name}`);
        cmds[cmd.name] = cmd;
    });

    // Exporting cmds
    return cmds;
}