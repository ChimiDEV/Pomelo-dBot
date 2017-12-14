const path = require('path');
const fs = require('fs');
const logger = require('../util/logger');

class ClientManager {
    static authentication(authPath) {
        let AuthDetails;
        // Read Authenticatins Details
        try {
            // align path with root path
            AuthDetails = require(path.join('../../', authPath));
        } catch (e) {
            logger.err('Please provide a authentication json file with a bot token.', 'Authentication');
            process.exit(0);
        }

        return AuthDetails;
    }

    static configure(configPath) {
        let Config;
        // Generate a config.json if not existing
        try {
            Config = require(path.join('../../', configPath));
        } catch (e) {
            Config.debug = true;
            Config.commandPrefix = '!';
            try {
                if (fs.lstatSync('./config.json').isFile()) {
                    logger.warn('WARNING: config.json found but we couldn\'t read it!\n' + e.stack, 'Configuration');
                }
            } catch (innerError) {
                fs.writeFile('./config.json', JSON.stringify(Config, null, 2), (err) => {
                    if (err) {
                        logger.err(err, 'Configuration');
                    }
                });
            }
        }

        return Config;
    }

    static permission(permissionPath, dangerousCommands) {
        // Permission Handling
        let Permissions = {};

        try {
            Permissions = require(path.join('../../', permissionPath));
        } catch (e) {
            Permissions.global = {};
            Permissions.users = {};

            dangerousCommands.forEach(cmd => {
                if (!Permissions.global.hasOwnProperty(cmd)) {
                    Permissions.global[cmd] = false;
                }
            });

            fs.writeFile('./permissions.json', JSON.stringify(Permissions, null, 2), () => {
                logger.info('Wrote new Permission File', 'Permission');
            });
        }

        Permissions.checkPermission = (user, permission) => {
            try {
                let allowed = true;
                try {
                    if (Permissions.global.hasOwnProperty(permission)) {
                        allowed = Permissions.global[permission] === true;
                    }
                } catch (err) {
                    logger.err(err, 'Permission');
                }

                try {
                    if (typeof Permissions.users[user.id] == 'undefined') return allowed;
                
                    if (Permissions.users[user.id].hasOwnProperty(permission)) {
                        allowed = Permissions.users[user.id][permission] === true;
                    }
                } catch (err) {
                    logger.err(err, 'Permission');
                }

                console.log(allowed);
                return allowed;
            } catch (err) {
                logger.err(err, 'Permission');
            }
            return false;
        }

        return Permissions;
    }

    static loadCommands() {
        let commands = require('../../loadModules.js')();
        logger.debug(commands, 'Loaded Commands');
        return commands;
    }
}

module.exports = ClientManager;