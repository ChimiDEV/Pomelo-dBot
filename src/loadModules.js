const fs = require('fs')
const logger = require('./lib/util/logger');

// load all modules in a Object
module.exports = () => {
    let cmds = {};

    let files = fs.readdirSync('./modules');

    files.forEach(module => {
        let cmd = require(`./modules/${module}`);
        logger.debug(cmd.module, `Load module - ${cmd.name}`);
        cmds[cmd.name] = cmd.module;
    });

    // Exporting cmds
    return cmds;
}