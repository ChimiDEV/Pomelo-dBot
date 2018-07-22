const fs = require('fs');
const header = require('waveheader');

let audio = fs.createReadStream('./opus');
let outputStream = fs.createWriteStream('./output.wav')
    .write(header(44100 * 8))
    

