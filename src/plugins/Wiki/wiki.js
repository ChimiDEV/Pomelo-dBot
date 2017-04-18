const Wiki = require('wikijs').default;

/* Command: Wiki */
exports.wiki = {
    usage: "<Search>",
    description: "Returns summary of first matching Wikipedia result",
    process: wikiSearch
}

function wikiSearch(bot, msg, suffix) {
    var query = suffix != "" ? suffix : null;
    if (!query) {
        msg.channel.sendMessage("Missing a search term");
        return;
    }

    Wiki().search(query, 1).then(data => {
            Wiki().page(data.results[0]).then(page => {
                page.summary().then(summary => {
                    var sumText = summary.toString().split('\n');
                    continuation(sumText, msg);
                }, errSummary => {
                    console.log(errSummary);
                });
            }, errPage => {
                console.log(errPage);
            });
        }, errSearch => {
            console.log(errSearch)
        }
    });
}

function continuation (sumText, msg) {
    var paragraph = sumText.shift();
    if (paragraph) {
        msg.channel.sendMessage(paragraph, continuation);
    }
};
/* --- */

exports.commands = [
    "wiki"
];
