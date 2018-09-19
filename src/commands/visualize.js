const request = require('request');

const visualizeCommand = {
	name: 'Visualize Color',
	triggers: ['visualize', 'color'],
	usage: '<hex or rgb>',
	description: 'Visualize any hex or rgb color.',
	process(client, msg, args) {
		let reqURL;
		let imageURL;

		if (args[0].length === 6 && !args[0].includes(',')) {
			reqURL = `http://www.thecolorapi.com/id?hex=${args[0]}`;
			imageURL = `https://serux.pro/rendercolour?hex=${args[0]}`;
		} else if (
			!isNaN(Number(args.join('').replace(/,/g, ''))) &&
			args.join(' ').includes(',') &&
			args.join(' ').split(',').length === 3
		) {
			reqURL = `http://www.thecolorapi.com/id?rgb=${args.join(' ').replace(/\s/g, '')}`;
			imageURL = `https://serux.pro/rendercolour?rgb=${args.join(' ').replace(/\s/g, '')}`;
		} else {
			return msg.channel.send(
				'This is not a valid format!\nYou need to specify a hex (Example: `000000`) or RGB (Example: `100, 100, 100`) color for this command.'
			);
		}

		request(reqURL, (req, res) => {
			const response = JSON.parse(res.body);
			const hexVal = response.hex.value;
			const rgbVal = response.rgb.value;

			return msg.channel.send({
				embed: {
					color: parseInt(response.hex.clean, 16),
					title: 'Color Visualization',
					// description: 'A very simple Embed!',
					thumbnail: { url: imageURL },
					fields: [
						{
							name: 'Hex',
							value: hexVal,
							inline: true
						},
						{
							name: 'RGB',
							value: rgbVal,
							inline: true
						}
					]
				}
			});
		});
	}
};

module.exports = visualizeCommand;
