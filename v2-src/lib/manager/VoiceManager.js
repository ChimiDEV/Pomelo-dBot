const fs = require('fs');
const header = require('waveheader'); 


const Config = require('../../config.json');
const logger = require('../util/logger');

class VoiceManager {

    static handleSpeaking(receiver, user, speaking) {
        if (speaking) {
            //logger.debug(`Listening to ${user}`, 'VoiceManager');

           /* let params = {
                model: 'en-US_BroadbandModel',
                content_type: 'audio/ogg;codecs=opus',
                'interim_results': false,
                'max_alternatives': 3,
                'word_confidence': false,
                timestamps: false,
                keywords: ['colorado', 'tornado', 'tornadoes'],
                'keywords_threshold': 0.5
            }

            let recognizeStream = speechToText.createRecognizeStream(params);
            fs.createReadStream('./124600702084317184-1513297373543.opus').pipe(recognizeStream);
            recognizeStream.pipe(fs.createWriteStream('transcription.txt'));
            recognizeStream.setEncoding('utf8');*/

            //const audioStream = receiver.createOpusStream(user);
            //let opus = fs.createWriteStream('./opus')

            

                //audioStream.pipe(outputStream);

        } else {
            //message.channel.send(`I'm no longer listening to ${user}`);
        }
    }
}

function generateOutputFile(member) {
    // use IDs instead of username cause some people have stupid emojis in their name
    const fileName = `./${member.id}-${Date.now()}.pcm`;
    return fs.createWriteStream(fileName);
  }

module.exports = VoiceManager;