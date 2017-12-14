const fs = require('fs');
const logger = require('./lib/util/logger');
const ClientManager = require('./lib/manager/ClientManager');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const AuthDetails = ClientManager.authentication('./auth.json');
const Config = ClientManager.configure('./config.json');
const Permissions = ClientManager.permission('./permissions.json', ['eval', 'ping']);
const Commands = ClientManager.loadCommands();

// Log Bot in
discordClient.login(AuthDetails.bot_token);

discordClient.on('ready', () => {
    logger.info(`Logged in! Serving in ${discordClient.guilds.array().length} servers`, 'discordClient');
    logger.info(`type ${Config.commandPrefix}help in Discord for Commandlist.`, 'discordClient');
    discordClient.user.setGame('Chill fam.');
});

/*discordClient.on('message', message => {

     if (message.content.startsWith(`${Config.commandPrefix}join`)) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                message.reply('Connected successfully to voice channel')
                let receiver = connection.createReceiver();
                let voiceChannel = message.member.voiceChannel;

                connection.on('speaking', (user, speaking) => {
                    if (speaking) {
                        message.channel.send(`Listening to ${user}`);
                        const audioStream = receiver.createPCMStream(user);

                        // create an output stream so we can dump our data in a file
                        //const output = generateOutputFile(voiceChannel, user);

                        // pipe our audio data into the file stream
                        //audioStream.pipe(output.stream);

                        audioStream.on('end', () => {
                            //message.channel.send(`I'm no longer listening to ${user}`);
                            // fs.unlink(output.fileName, err => {
                            //     if (err) {
                            //         console.log(err);
                            //     }
                            // });
                        });
                    } else {
                        message.channel.send(`I'm no longer listening to ${user}`);
                    }
                });

            }).catch(console.log);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});*/

// Message Handling
let handleMessage = message => {
    if (!message.guild) {
        return;
    }

    // Check if message is a command
    if (message.author.id !== discordClient.user.id && (message.content.startsWith(Config.commandPrefix))) {
        logger.info(`Treating ${message.content} form ${message.author} as command`, discordClient);

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
                            description = desc();
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
                            description = desc();
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
    }
}

discordClient.on('message', handleMessage);