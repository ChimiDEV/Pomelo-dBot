const Config = require('../../config.json')

const logger = {
    info: (msg, name) => {
        console.log(`\x1b[32mINFO - ${name}: \x1b[0m`);
        console.log(msg)
        console.log(`\x1b[32m--- --- ---\x1b[0m\n`)
    },

    err: (msg, name) => {
        console.log(`\x1b[31mERROR - ${name}:\x1b[0m`);
        console.log(msg);
        console.log(`\x1b[31m--- --- ---\x1b[0m\n`);
    },

    warn: (msg, name) => {
        console.log(`\x1b[33mERROR - ${name}:\x1b[0m`);
        console.log(msg);
        console.log(`\x1b[33m--- --- ---\x1b[0m\n`);
    },

    debug: (msg, name) => {
        if (Config.debug) {
            console.log(`\x1b[36mDEBUG - ${name}:\x1b[0m`);
            console.log(msg);
            console.log(`\x1b[36m--- --- ---\x1b[0m\n`);
        }
    }
}

module.exports = logger;
