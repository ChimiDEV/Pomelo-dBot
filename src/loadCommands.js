const fs = require('fs')
const logger = require('./lib/util/logger');

// load all commands in an object
module.exports = () => {
    let cmds = {};

    let files = fs.readdirSync('./src/commands');

    files.forEach(command => {
        let cmd = require(`./commands/${command}`);
        logger.debug(cmd.module, `Load command - ${cmd.name}`);
        if(Array.isArray(cmd.triggers)) {
            cmd.triggers.forEach(trigger => {
                cmds[trigger] = cmd;
            });
        } else {
            cmds[cmd.triggers] = cmd;
        }
    });

    // Exporting cmds
    return cmds;
}