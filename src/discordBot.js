const fs = require('fs');
const logger = require('./lib/util/logger');
const ClientManager = require('./lib/manager/ClientManager');
const VoiceManager = require('./lib/manager/VoiceManager');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const AuthDetails = ClientManager.authentication('./auth.json');
const Config = ClientManager.configure('./config.json');
const Permissions = ClientManager.permission('./permissions.json', ['eval', 'exit']);
const Commands = ClientManager.loadCommands();

// const TextToSpeech = require('./lib/manager/TextToSpeechManager').getSharedInstance();

// Message Handling
let handleMessage = message => {
    if (!message.guild) {
        return;
    }

    // Check if message is a command
    if (message.author.id !== discordClient.user.id && (message.content.startsWith(Config.commandPrefix))) {
        logger.info(`Treating ${message.content} from ${message.author.username} as command`, 'discordClient');

        let cmdTxt = message.content.split(' ')[0].substring(Config.commandPrefix.length);
        let suffix = message.content.substring(cmdTxt.length + Config.commandPrefix.length + 1);

        if (message.isMentioned(discordClient.user)) {
            try {
                cmdTxt = message.content.split(' ')[1];
                suffix = message.content.substring(discordClient.user.mention().length + cmdTxt.length + Config.commandPrefix.length + 1);
            } catch (e) {
                message.channel.send('Yes?');
                return;
            }
        }

        let cmd = Commands[cmdTxt];
        if (cmdTxt == 'help') {
            // Help is special since it iterates over the other commands
            if (suffix) {
                // give help for given arguments
                let cmds = suffix.split(' ').filter(cmd => {
                    return Commands[cmd];
                });
                let info = '';
                if(cmds.length > 0) {
                    cmds.forEach(cmdName => {
                        info += `** ${Config.commandPrefix}${cmdName} **`;
                        let usage = Commands[cmdName].usage;
                        if (usage) {
                            info += ` ${usage}`;
                        }

                        let description = Commands[cmdName].description;
                        if (description instanceof Function) {
                            description = description();
                        }
                        if (description) {
                            info += `\n\t ${description}`;
                        }
                        info += '\n';
                    });
                } else {
                    info = `No ** ${suffix} ** Command found`;
                }
                message.channel.send(info);
            } else {
                // Give help for all commands
                message.author.send('**Available Commands:**').then(() => {
                    let batch = '';
                    let sortedCommands = Object.keys(Commands).sort();

                    sortedCommands.forEach(cmdName => {
                        let info = `** ${Config.commandPrefix}${cmdName} **`;
                        let usage = Commands[cmdName].usage;
                        if (usage) {
                            info += ` ${usage}`;
                        }

                        let description = Commands[cmdName].description;
                        if (description instanceof Function) {
                            description = description();
                        }
                        if (description) {
                            info += `\n\t ${description}`;
                        }
                        info += '\n';

                        let newBatch = `${batch}\n${info}`; 
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
            if (Permissions.checkPermission(message.author, cmdTxt)) {
                cmd.process(discordClient, message, suffix);
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
discordClient.login(AuthDetails.bot_token);

discordClient.on('ready', () => {
    logger.info(`Logged in! Serving in ${discordClient.guilds.array().length} servers`, 'discordClient');
    logger.info(`type ${Config.commandPrefix}help in Discord for Commandlist.`, 'discordClient');
    discordClient.user.setGame('Fortlul');

    // Prepare 'standard' textChannel to send Message to
    if (Config.guildName && Config.textChannel) {
        let guild = discordClient.guilds.find('name', Config.guildName);
        if (guild) {
            let textChannel = guild.channels.find('name', Config.textChannel)
            if (textChannel) {
                logger.info('Add standard text channel for messages', 'discordClient');
                discordClient._standardTextChannel = textChannel;
            }
        }
    } else {
        logger.info(`Client couldn't add a standard text channel, some functions may not work`, 'discordClient');
    }

    // Join voice channel, if guildName and joinChannel is given and listen for hotword
    if (Config.guildName && Config.joinChannel) {
        let guild = discordClient.guilds.find('name', Config.guildName);
        if (guild) {
            let voiceChannel = guild.channels.find('name', Config.joinChannel);
            if (voiceChannel) {
                voiceChannel.join()
                    .then(connection => {
                        // Configure connected voiceChannel
                        discordClient._voiceChannel = voiceChannel;
                        discordClient._voiceChannelConnection = connection;

                        logger.info(`Client joined ${voiceChannel.name}@${guild.name}`, 'discordClient');
                        if (discordClient._standardTextChannel) {
                            //discordClient._standardTextChannel.send(`Client joined ${voiceChannel.name}@${guild.name}`);                        
                        }

                        // TextToSpeech.speak(discordClient._voiceChannelConnection, 'Hallo Jannik, kek');

                        // Prepare EventListener for listening
                        // let receiver = connection.createReceiver();
                        // connection.on('speaking', (user, speaking) => {
                        //     VoiceManager.handleSpeaking(receiver, user, speaking);
                        // });
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

    console.log()

    if (!oldUserChannel && newUserChannel && !newUser.user.bot) {
        // New Member joined
        if (discordClient._voiceChannel.id == newUser.voiceChannel.id) {
            logger.debug(`${newUser.nickname || newUser.user.username} joined the channel ${newUser.voiceChannel.name}`, 'discordClient')
            // User joined channel of Bot

            // TextToSpeech.speak(discordClient._voiceChannelConnection, `Hallo ${newUser.user.username}`, 'de-DE_BirgitVoice');
        }
    } else if (!newUserChannel) {
        // User left a channel
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