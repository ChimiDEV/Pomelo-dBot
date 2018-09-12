const path = require('path');
const fs = require('fs');
const logger = require('../util/logger');

class ClientManager {
    static authentication(authPath) {
        let authDetails;
        // Read Authenticatins Details
        try {
            // align path with root path
            authDetails = require(path.join('../../', authPath));
        } catch (e) {
            logger.err('Please provide a authentication json file with a bot token.', 'Authentication');
            process.exit(0);
        }

        return authDetails;
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
        let permissions = {};

        try {
            permissions = require(path.join('../../', permissionPath));
        } catch (e) {
            permissions.global = {};
            permissions.users = {};

            dangerousCommands.forEach(cmd => {
                if (!permissions.global.hasOwnProperty(cmd)) {
                    permissions.global[cmd] = false;
                }
            });

            fs.writeFile('./permissions.json', JSON.stringify(permissions, null, 2), () => {
                logger.info('Wrote new Permission File', 'Permission');
            });
        }

        permissions.checkPermission = (user, permission) => {
            try {
                let allowed = true;
                try {
                    if (permissions.global.hasOwnProperty(permission)) {
                        allowed = permissions.global[permission] === true;
                    }
                } catch (err) {
                    logger.err(err, 'Permission');
                }

                try {
                    if (typeof permissions.users[user.id] == 'undefined') return allowed;
                
                    if (permissions.users[user.id].hasOwnProperty(permission)) {
                        allowed = permissions.users[user.id][permission] === true;
                    }
                } catch (err) {
                    logger.err(err, 'Permission');
                }

                return allowed;
            } catch (err) {
                logger.err(err, 'Permission');
            }
            return false;
        }

        return permissions;
    }

    static loadCommands() {
        let commands = require('../../loadCommands')();
        logger.debug(commands, 'Loaded Commands');
        return commands;
    }
}

module.exports = ClientManager;