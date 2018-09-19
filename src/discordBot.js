const fs = require('fs');
const Discord = require('discord.js');

const logger = require('./lib/util/logger');
const ClientManager = require('./lib/manager/ClientManager');

const discordClient = new Discord.Client();
const authDetails = ClientManager.authentication('./auth.json');
const config = ClientManager.configure('./config.json');
const permissions = ClientManager.permission('./permissions.json', ['eval', 'exit']);
const commands = ClientManager.loadCommands();

let voiceList = {};

// Message Handling
let handleMessage = message => {
    if (!message.guild) {
        return;
    }

    // Check if message is a command
    if (message.author.id !== discordClient.user.id && (message.content.startsWith(config.commandPrefix))) {
        logger.info(`Treating ${message.content} from ${message.author.username} as command`, 'discordClient');

        let cmdTxt = message.content.split(' ')[0].substring(config.commandPrefix.length);
        let suffix = message.content.substring(cmdTxt.length + config.commandPrefix.length + 1);
        if (message.isMentioned(discordClient.user)) {
            try {
                cmdTxt = message.content.split(' ')[1];
                suffix = message.content.substring(discordClient.user.mention().length + cmdTxt.length + config.commandPrefix.length + 1);
            } catch (e) {
                message.channel.send('Yes?');
                return;
            }
        }

        let cmd = commands[cmdTxt];
        if (cmdTxt == 'help') {
            // Help is special since it iterates over the other commands
            if (suffix) {
                // give help for given arguments
                let cmds = suffix.split(' ').filter(cmd => {
                    return commands[cmd];
                });
                let info = '';
                if(cmds.length > 0) {
                    cmds.forEach(cmdName => {
                        const currCmd = commands[cmdName];
                        info = `---------------\n**${currCmd.name}**\n`;
                        
                        let trigger = `\`\`\``;
                        if (Array.isArray(currCmd.triggers)) {
                            currCmd.triggers.forEach(t => {
                                trigger += `${config.commandPrefix}${t}\n`;
                            })
                        } else {
                            trigger += `${config.commandPrefix}${currCmd.triggers}\n`;
                        }
                        info += `${trigger}\`\`\``;

                        const usage = commands[cmdName].usage;
                        if (usage) {
                            info += `\`Arguments: ${usage}\`\n`;
                        }

                        let description = commands[cmdName].description;
                        if (description instanceof Function) {
                            description = description();
                        }
                        if (description) {
                            info += `${description}\n`;
                        }

                        info += '---------------\n\n';
                    });
                } else {
                    info = `No ** ${suffix} ** Command found`;
                }
                message.channel.send(info);
            } else {
                // Give help for all commands
                message.author.send('**Available commands:**').then(() => {
                    let batch = '';
                    let sortedCommands = Object.keys(commands).sort();
                    let commandSeen = {};
                    let filteredCommands = sortedCommands.filter(cmdName => {
                        const currCmd = commands[cmdName];
                        if(commandSeen[currCmd.name]) {
                            return false;
                        } else {
                            commandSeen[currCmd.name] = true;
                            return true;
                        }
                    });

                    filteredCommands.forEach(cmdName => {
                        const currCmd = commands[cmdName];
                        let info = `---------------\n**${currCmd.name}**\n`;
                        
                        let trigger = `\`\`\``;
                        if (Array.isArray(currCmd.triggers)) {
                            currCmd.triggers.forEach(t => {
                                trigger += `${config.commandPrefix}${t}\n`;
                            })
                        } else {
                            trigger += `${config.commandPrefix}${currCmd.triggers}\n`;
                        }
                        info += `${trigger}\`\`\``;

                        const usage = commands[cmdName].usage;
                        if (usage) {
                            info += `\`Arguments: ${usage}\`\n`;
                        }

                        let description = commands[cmdName].description;
                        if (description instanceof Function) {
                            description = description();
                        }
                        if (description) {
                            info += `${description}\n`;
                        }

                        info += '---------------\n\n';
                        const newBatch = `${batch}${info}`; 
                        if (newBatch.length > (1024 - 8)) {
                            message.author.send(batch);
                            batch = info;
                        } else {
                            batch = newBatch;
                        }
                    });

                    if (batch.length > 0) {
                        message.author.send(batch);
                    }
                });
            }
        } else if (cmd) {
            if (permissions.checkPermission(message.author, cmdTxt)) {
                const args = suffix.split(' ').filter(arg => arg !== '');
                cmd.process(discordClient, message, args);
            } else {
                message.channel.send(`You are not allowed to run ${cmdTxt}!`);
            }
        } else {
            message.channel.send('No valid Command. Try !help');
        }
    } else if (message.author.id !== discordClient.user.id) {
        // Try watson conversation for analysis
    }
}

// Log Bot in
discordClient.login(authDetails.botToken);

discordClient.on('ready', () => {
    logger.info(`Logged in! Serving in ${discordClient.guilds.array().length} servers`, 'discordClient');
    logger.info(`type ${config.commandPrefix}help in Discord for Commandlist.`, 'discordClient');
    discordClient.user.setActivity('📈 Upgrade in progress 1%...');

    // Prepare 'standard' textChannel to send Message to
    if (config.guildName && config.textChannel) {
        let guild = discordClient.guilds.find(guild => guild.name === config.guildName);
        if (guild) {
            let textChannel = guild.channels.find(channels => channels.name === config.textChannel)
            if (textChannel) {
                logger.info('Add standard text channel for messages', 'discordClient');
                discordClient._standardTextChannel = textChannel;
            }
        }
    } else {
        logger.info(`Client couldn't add a standard text channel, some functions may not work`, 'discordClient');
    }

    // Join voice channel, if guildName and joinChannel is given and listen for hotword
    if (config.guildName && config.joinChannel) {
        let guild = discordClient.guilds.find(guild => guild.name === config.guildName);
        if (guild) {
            let voiceChannel = guild.channels.find(channels => channels.name === config.joinChannel);
            if (voiceChannel) {
                voiceChannel.join()
                    .then(connection => {
                        // Configure connected voiceChannel
                        discordClient._voiceChannel = voiceChannel;
                        discordClient._voiceChannelConnection = connection;

                        logger.info(`Client joined ${voiceChannel.name}@${guild.name}`, 'discordClient');
                        // if (discordClient._standardTextChannel) {
                        //     discordClient._standardTextChannel.send(`Client joined ${voiceChannel.name}@${guild.name}`);                        
                        // }
                    })
                    .catch(err => {
                        logger.err(err, 'discordClient')
                    });
            } else {
                logger.warn(`Client couldn't join the channel, joinChannel is not correct`, 'discordClient');            
            }
        } else {
            logger.warn(`Client couldn't join a channel, guildName is not correct`, 'discordClient');
        }
    } else {
        logger.info(`Client couldn't join a channel, please specify a guildName and joinChannel inside config.json`, 'discordClient');
    }
});

discordClient.on('message', handleMessage);
discordClient.on('voiceStateUpdate', (oldUser, newUser) => {
    let newUserChannel = newUser.voiceChannel
    let oldUserChannel = oldUser.voiceChannel

    if (!oldUserChannel && newUserChannel && !newUser.user.bot) {
        // New Member joined
        if (discordClient._voiceChannel.id == newUser.voiceChannel.id) {
            logger.debug(`${newUser.nickname || newUser.user.username} joined the channel ${newUser.voiceChannel.name}`, 'discordClient')
            voiceList[newUser.user.username] = true;
            // Do something if needed (currently not anymore)
        }
    } else if (!newUserChannel) {
        // User left a channel
        voiceList[newUser.user.username] = false;
    }
})

discordClient.on('disconnected', () => {
    logger.info('Disconnected!', 'discordClient');
    process.exit(1);
});

// Handle process exit
process.on('exit', code => {
    logger.info('Destroy discord Client', 'Process');
    discordClient.destroy();
});