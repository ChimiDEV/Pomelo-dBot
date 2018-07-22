const fs = require('fs');

const TextToSpeech = require('watson-developer-cloud/text-to-speech/v1');
const AuthDetails = require('../../auth.json');
const Config = require('../../config.json');

class TextToSpeechManager {
    constructor(username, password) {
        this.watson = new TextToSpeech ({
            'username': AuthDetails.watson_tts_username,
            'password': AuthDetails.watson_tts_password,
        });

    }

    static getSharedInstance() {
        if (!TextToSpeechManager.sharedInstance) {
            TextToSpeechManager.sharedInstance = new TextToSpeechManager(AuthDetails.watson_tts_username, AuthDetails.watson_tts_password);
        }
        return TextToSpeechManager.sharedInstance;
    }

    speak(voiceChannelConnection, text = '', voice = 'de-DE_BirgitVoice') {

        if (!voiceChannelConnection) {
            return;
        }

        let params = {
            text,
            voice,
            accept: 'audio/mp3'
        };

        let audioRequest = (this.watson.synthesize(params).pipe(fs.createWriteStream('./speak.mp3')));
        setTimeout(() => {
            const dispatcher = voiceChannelConnection.playFile('./speak.mp3');            
        }, Config.timeoutTTS)
    }
}

module.exports = TextToSpeechManager;