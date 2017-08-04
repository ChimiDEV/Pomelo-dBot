var sendmail = require('sendmail')();

/* Command: IFTTT */
exports.ifttt = {
    description: 'IFTTT Command',
    process: iftttFunction
}

function iftttFunction(bot, msg, suffix) {
    sendmail({
        from: 'chimidev@gmail.com',
        to: 'trigger@applet.ifttt.com',
        subject: '#testPomelo',
        html: 'Mail of test sendmail',
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
}
/* --- */

exports.commands = [
    'ifttt'
];
