/* Command: XYZ */
exports.test = {
    description: "Test Command",
    process: testFunction
}

function testFunction(bot, msg, suffix) {
    console.log(msg.content);
}
/* --- */

exports.commands = [
    "test"
];