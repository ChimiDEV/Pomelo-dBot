module.exports = client => {
    const config = client._config;
    const logger = client._logger;
    logger.info(`Logged in! Serving in ${client.guilds.array().length} servers`, 'Discord Client');
    logger.info(`type ${config.commandPrefix}help in Discord for Commandlist.`, 'Discord Client');
    client.user.setActivity(`📈 Upgrade in progress ${Math.floor(100 * Math.random())}%...`);

    // Prepare 'standard' textChannel to send Message to
    if (config.guildName && config.textChannel) {
        let guild = client.guilds.find(guild => guild.name === config.guildName);
        if (guild) {
            let textChannel = guild.channels.find(channels => channels.name === config.textChannel)
            if (textChannel) {
                logger.info('Add standard text channel for messages', 'Discord Client');
                client._standardTextChannel = textChannel;
            }
        }
    } else {
        logger.info(`Client couldn't add a standard text channel, some functions may not work`, 'Discord Client');
    }

    // Join voice channel, if guildName and joinChannel is given and listen for hotword
    if (config.guildName && config.joinChannel) {
        let guild = client.guilds.find(guild => guild.name === config.guildName);
        if (guild) {
            let voiceChannel = guild.channels.find(channels => channels.name === config.joinChannel);
            if (voiceChannel) {
                voiceChannel.join()
                    .then(connection => {
                        // Configure connected voiceChannel
                        client._voiceChannel = voiceChannel;
                        client._voiceChannelConnection = connection;

                        logger.info(`Client joined ${voiceChannel.name}@${guild.name}`, 'Discord Client');
                        // if (discordClient._standardTextChannel) {
                        //     discordClient._standardTextChannel.send(`Client joined ${voiceChannel.name}@${guild.name}`);                        
                        // }
                    })
                    .catch(err => {
                        logger.err(err, 'Discord Client')
                    });
            } else {
                logger.warn(`Client couldn't join the channel, joinChannel is not correct`, 'Discord Client');            
            }
        } else {
            logger.warn(`Client couldn't join a channel, guildName is not correct`, 'Discord Client');
        }
    } else {
        logger.info(`Client couldn't join a channel, please specify a guildName and joinChannel inside config.json`, 'Discord Client');
    }
};