const fs = require('fs')

// 'Mock' Client to get logger functions
const tmp = {};
require('./lib/util/logger')(tmp);
const logger = tmp._logger;

// load all commands in an object
module.exports = () => {
    let cmds = {};

    const files = fs.readdirSync('./src/commands');

    files.forEach(command => {
        let cmd = require(`./commands/${command}`);
        logger.debug(`Loaded`, `Command - ${cmd.name}`);
        if(Array.isArray(cmd.triggers)) {
            cmd.triggers.forEach(trigger => {
                cmds[trigger] = cmd;
            });
        } else {
            cmds[cmd.triggers] = cmd;
        }
    });

    // Exporting cmds
    logger.debug(cmds, 'Loaded Commands');
    return cmds;
}