const Discord = require('discord.js');
const discordClient = new Discord.Client();

let Config;
let AuthDetails;

// Read Authenticatins Details
try {
    AuthDetails = require('./auth.json')
} catch (e) {
    console.log('Please provide a authentication json file with a bot token.');
    process.exit();
}

// Generate a config.json
try {
    Config = require('./config.json');
} catch (e) {
    Config.debug = false;
    Config.commandPrefix = '!';
    try {
        if (fs.lstatSync('./config.json').isFile()) {
            console.log('WARNING: config.json found but we couldn\'t read it!\n' + e.stack);
        }
    } catch (innerError) {
        fs.writeFile('./config.json', JSON.stringify(Config, null, 2));
    }
}

// Log Bot in
discordClient.login(AuthDetails.bot_token);

discordClient.on('message', message => {
    if (!message.guild) {
        return;
    }

    if (message.content.startsWith(`${Config.commandPrefix}join`)) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    message.reply('Connected successfully to voice channel')

                    connection.on('speaking', (user, speaking) => {
                        if (speaking) {
                            message.channel.send(`Listening to ${user}`)
                        }
                    });

                })
                .catch(console.log);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});
