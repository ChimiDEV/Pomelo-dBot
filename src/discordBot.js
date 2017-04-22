const fs = require('fs');

/* Extensions */
const twitchNotifier = require('./extensions/Twitch/twitch.js');
/* --- */

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
    console.log(promise);
});

try {
    var Discord = require('discord.js');
} catch (e) {
    console.log(e.stack);
    console.log(process.version);
    process.exit();
}

console.log('Starting DiscordBot');

try {
    var AuthDetails = require('./auth.json')
} catch (e) {
    console.log('Please provide a authentication json file with a bot token.');
    process.exit();
}

// Load custom permissions
var dangerousCommands = ['eval'];
var Permissions = {};

try {
    Permissions = require('./permissions.json');
} catch (e) {
    Permissions.global = {};
    Permissions.users = {};

    for (var i = 0; i < dangerousCommands.length; i++) {
        var cmd = dangerousCommands[i];
        if (!Permissions.global.hasOwnProperty(cmd)) {
            Permissions.global[cmd] = false;
        }
    }

    fs.writeFile('./permissions.json', JSON.stringify(Permissions, null, 2), () => {
        console.log('Wrote new Permission File');
    });
}

Permissions.checkPermission = function(user, permission) {
    try {
        var allowed = true;

        try {
            if (Permissions.global.hasOwnProperty(permission)) {
                allowed = Permissions.global[permission] === true;
            }
        } catch (err) {
            console.log(err);
        }

        try {
            if (Permissions.users[user.id].hasOwnProperty(permission)) {
                allowed = Permissions.users[user.id][permission] === true;
            }
        } catch (err) {
            console.log(err);
        }

        return allowed;
    } catch (err) {
        console.log(err);
    }
    return false;
}

// Load Config Data
var Config = {};

try {
    Config = require('./config.json');
} catch (e) {
    Config.debug = false;
    Config.commandPrefix = '!';
    Config.twitchNotify = [];
    try {
        if (fs.lstatSync('./config.json').isFile()) {
            console.log('WARNING: config.json found but we couldn\'t read it!\n' + e.stack);
        }
    } catch (innerError) {
        fs.writeFile('./config.json', JSON.stringify(Config, null, 2));
    }
}

if (!Config.hasOwnProperty('commandPrefix')) {
    Config.commandPrefix = '!';
}

var commands = {
    'ping': {
        description: 'Responds pong, useful for checking if bot is alive.',
        process: function(bot, msg, suffix) {
            msg.channel.sendMessage(msg.author + ' pong!');
            if (suffix) {
                msg.channel.sendMessage(' Note that !ping takes no arguments!');
            }
        }
    },
    'pong': {
        description: 'Responds to Pakku, because only he is that stupid.',
        process: function(bot, msg, suffix) {
            msg.channel.sendMessage(msg.author + ' Idiot.');
        }
    }
};

function checkMessageForCommands(msg, isEdit) {
    // Check if message is a command
    if (msg.author.id != bot.user.id && (msg.content.startsWith(Config.commandPrefix))) {
        console.log('Treating ' + msg.content + ' from ' + msg.author + ' as command');
        var cmdTxt = msg.content.split(' ')[0].substring(Config.commandPrefix.length);
        var suffix = msg.content.substring(cmdTxt.length + Config.commandPrefix.length + 1);
        if (msg.isMentioned(bot.user)) {
            try {
                cmdTxt = msg.content.split(' ')[1];
                suffix = msg.content.substring(bot.user.mention().length + cmdTxt.length + Config.commandPrefix.length + 1);
            } catch (e) {
                msg.channel.sendMessage('Yes?');
                return;
            }
        }
        var cmd = commands[cmdTxt];

        if (cmdTxt === 'help') {
            // Help is special since it iterates over the other commands
            if (suffix) {
                // give help for given arguments
                var cmds = suffix.split(' ').filter(function(cmd) {
                    return commands[cmd]
                });
                var info = '';
                if (cmds.length > 0) {
                    for (var i = 0; i < cmds.length; i++) {
                        var currCmd = cmds[i];
                        info += '**' + Config.commandPrefix + currCmd + '**';

                        var usage = commands[currCmd].usage;
                        if (usage) {
                            info += ' ' + usage;
                        }

                        var desc = commands[currCmd].description;
                        if (desc instanceof Function) {
                            desc = desc();
                        }
                        if (desc) {
                            info += '\n\t' + desc;
                        }
                        info += '\n'
                    }
                } else {
                    info = 'No **' + suffix + '** Command found'
                }
                msg.channel.sendMessage(info);
            } else {
                // Give help to all commands
                msg.author.sendMessage('**Available Commands:**').then(function() {
                    var batch = '';
                    var sortedCommands = Object.keys(commands).sort();

                    for (var i in sortedCommands) {
                        var currCmd = sortedCommands[i];
                        var info = '**' + Config.commandPrefix + currCmd + '**';

                        var usage = commands[currCmd].usage;
                        if (usage) {
                            info += ' ' + usage;
                        }

                        var desc = commands[currCmd].description;
                        if (desc instanceof Function) {
                            desc = desc();
                        }
                        if (desc) {
                            info += '\n\t' + desc;
                        }

                        var newBatch = batch + '\n' + info;
                        if (newBatch.length > (1024 - 8)) {
                            msg.author.sendMessage(batch);
                            batch = info;
                        } else {
                            batch = newBatch;
                        }
                    }

                    if (batch.length > 0) {
                        msg.author.sendMessage(batch);
                    }
                });
            }
        } else if (cmd) {
            if (Permissions.checkPermission(msg.author, cmdTxt)) {
                try {
                    // Execute Command
                    cmd.process(bot, msg, suffix, isEdit);
                } catch (e) {
                    var msgText = 'command ' + cmdTxt + ' failed.'
                    if (Config.debug) {
                        msgTxt = '\n' + e.stack;
                    }
                    console.log(e.stack);
                    msg.channel.sendMessage(msgText);
                }
            } else {
                msg.channel.sendMessage('You are not allowed to run ' + cmdTxt + '!');
            }
        } else {
            // Message is no valid command
            if (msg.author == bot.user) {
                return;
            } else {
                msg.channel.send('No valid Command. Try !help')
            }
        }
    }
}
// Initialize Bot and set Eventlistener
var bot = new Discord.Client();

bot.on('ready', () => {
    console.log('Logged in! Serving in ' + bot.guilds.array().length + ' servers');
    //require('./plugins.js').init();
    console.log('type ' + Config.commandPrefix + 'help in Discord for Commandlist.');
    bot.user.setGame('Chill fam.');

    // Start non-interactive functions (no need for a command)
    twitchNotifier.notifier(bot);
});

bot.on('disconnected', function() {
    console.log('Disconnected!');
    process.exit(1);
});

bot.on('message', (msg) => checkMessageForCommands(msg, false));
bot.on('messageUpdate', (oldMsg, newMsg) => checkMessageForCommands(newMsg, true));

bot.on('presence', function(user, status, gameID) {
    console.log(user + ' went ' + status);
});

if (AuthDetails.bot_token) {
    console.log('Logging in with token');
    bot.login(AuthDetails.bot_token);
}

exports.addCommand = function(commandName, commandObject) {
    try {
        commands[commandName] = commandObject;
    } catch (err) {
        console.log(err);
    }
}
