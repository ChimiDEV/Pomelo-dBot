const Command = require('../lib/Command');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const hackCommand = new Command({
	name: 'Hack a User',
	triggers: 'hack',
	usage: '<username>',
	description: 'Hack a user. Be careful!',
	missingArgs: 'Who you wanna hack, boi?',
	async process(client, msg, args) {
		const userString = args[0];
		const resolvedUser = msg.channel.guild.members.find(
			member => member.user.username === userString || member.nickname === userString
		);
		if (resolvedUser) {
			const prompt = await msg.channel.send(
				`Hacking ${resolvedUser.user.username} now...`
			);
			await sleep(1500);
			await prompt.edit('Finding discord login...');
			await sleep(1700);
			await prompt.edit(
				`Found:\n**Email**: \`${resolvedUser.user.username}***@gmail.com\`\n**Password**: \`*******\``
			);
			await sleep(1700);
			await prompt.edit('Fetching dms');
			await sleep(1000);
			await prompt.edit('Listing most common words...');
			await sleep(1000);
			await prompt.edit(`Injecting virus into discriminator #${resolvedUser.user.discriminator}`);
			await sleep(1000);
			await prompt.edit('Virus injected');
			await sleep(1000);
			await prompt.edit('Finding IP address');
			await sleep(2000);
			await prompt.edit('Spamming email...');
			await sleep(1000);
			await prompt.edit('Selling data to facebook...');
			await sleep(1000);
			await prompt.edit(`Finished hacking ${resolvedUser.user.username}`);
			msg.channel.send('The hack is complete.');
		}
	}
});

module.exports = hackCommand;
