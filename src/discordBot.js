const fs = require('fs');
const Discord = require('discord.js');
const ClientManager = require('./lib/manager/ClientManager');

const discordClient = new Discord.Client();
const authDetails = ClientManager.authentication('./auth.json');

// Creates a _util object for some shared functionality, also adds _logger to discordClient
require('./lib/util/utility')(discordClient);
discordClient._config = ClientManager.configure('./config.json');
discordClient._permissions = ClientManager.permission('./permissions.json', ['eval', 'exit']);
discordClient._commands = ClientManager.loadCommands();

const monitorFiles = fs.readdirSync('./src/monitors');
monitorFiles.forEach(file => {
    discordClient._monitors = [];
    discordClient._monitors.push(require(`./monitors/${file}`));
    discordClient._logger.debug('Loaded', `Monitor - ${file.split('.')[0]}`);
})

const eventFiles = fs.readdirSync('./src/events');
eventFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);

    discordClient._logger.debug(`Loaded`, `Event - ${eventName}`);
    discordClient.on(eventName, event.bind(null, discordClient));
});

// Log Bot in
discordClient.login(authDetails.botToken);

// Handle process exit
process.on('exit', code => {
    discordClient.destroy();
    discordClient._logger.info('Destroy discord Client', 'Process');
});