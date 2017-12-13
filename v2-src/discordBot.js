const fs = require('fs');
const {Writable} = require('stream');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

function generateOutputFile(channel, member) {
    // use IDs instead of username cause some people have stupid emojis in their name
    const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.pcm`;
    return {
        fileName,
        stream: fs.createWriteStream(fileName)
    };
}

let Config = {};
let AuthDetails = {};

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
        fs.writeFile('./config.json', JSON.stringify(Config, null, 2), (err) => {
            if (err) {
                console.log(err);
            }
        });
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
});
