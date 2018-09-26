const pokeNames = require('pokemon');
const request = require('request');
const cheerio = require('cheerio');
const convert = require('convert-units')
const PokeSpriter = require('pokedex');
const Pokedex = require('pokedex-api');

const Command = require('../lib/Command');

const pokeSpriter = new PokeSpriter();
const pokedex = new Pokedex({
  userAgent: 'PomeloBot (https://github.com/ChimiDEV/Pomelo-dBot, v0.0.3)',
});

const pokedexCommand = new Command({
  name: 'Pokedex',
	triggers: ['pokedex'],
	description: 'Get the data entry of a specified pokemon.',
	usage: '<pokemon name>',
	async process(client, msg, args) {
		const pivotPokemon = args[0];
    const pokeID = getPokemonID(pivotPokemon);
		if (pokeID) {
      const entries = await pokedex.getPokemonByNumber(pokeID);
      const pokemonEntry = entries[0];
      const pokemonName = pokemonEntry.name;
      let pokemonSprite = pokeSpriter.pokemon(pokeID).sprites.animated;
      if (!pokemonSprite) {
        pokemonSprite = pokemonEntry.sprite;
      }
      request(`https://pokemondb.net/pokedex/${pokemonName}`, (req, res, body) => {
        const $ = cheerio.load(body);

        // For the love of god... please don't ask...
        // Parsing the pokemondb website with following steps:
        /*
         * 0. Pokemondb class names are dynamic and generic, no way to select pokedex descriptions directly
         * 1. Find "Pokedex Entry" header 
         * 2. Select next "div" which contains the table (sometimes a header is in between... URGH)
         * 3. Navigate following way: div (first)> table (first)> tbody (last)> tr (last)> td > text
        */
        const headers = $('h2');
        let pokedexDescriptions = $(headers).filter(function() {return $(this).text() === 'Pokédex entries'}).next();
        if($(pokedexDescriptions).prop('tagName') !== 'DIV') {
          pokedexDescriptions = $(pokedexDescriptions).next();
        }
        const engDesc = $(pokedexDescriptions).children().first().children().first().children().last().children().last().text();
        convertWeight(pokemonEntry.weight);
        msg.channel.send({
          embed: {
            color: 0xcc0000,
            author: {
              name: 'Pokedex',
              url: `https://pokemondb.net/pokedex/${pokemonName}`,
              icon_url: 'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2017/09/Pokemon-GO-GEN-4-Pokedex.png'
            },
            title: `**${pokemonEntry.name}**`,
            description:`_${pokemonEntry.species}_ | ${pokemonEntry.types.join(', ')}\n\`\`\`${engDesc}\`\`\`\n`, 
            thumbnail: { url: pokemonSprite },
            image: { url: getPokeTypeURL(pokemonEntry.types[0]) },
            fields: [
              {
                name: 'Height',
                value: `${pokemonEntry.height} | ${convertHeight(pokemonEntry.height)} m`,
                inline: true
              },
              {
                name: 'Weight',
                value: `${pokemonEntry.weight} | ${convertWeight(pokemonEntry.weight)} kg`,
                inline: true
              },
              {
                name: 'Abilities',
                value: `${pokemonEntry.abilities.normal.join('\n')}\n_${pokemonEntry.abilities.hidden.join('\n')}_`
              },
              {
                name: 'Evolution Chain',
                value: pokemonEntry.family.evolutionLine.join('\n')
              }
            ],
            footer: {text: `First time seen in Gen ${pokemonEntry.gen} | Starter: ${pokemonEntry.starter ? 'Yes' : 'No'} | Legendary: ${pokemonEntry.legendary ? 'Yes' : 'No'}`}
          }
        });
      });
		} else {
      msg.channel.send('Pokemon not found');
    }
	}
});

function getPokemonID(pokeName) {
	// Anonymous function
	function getID(pokeName, lang) {
		try {
			return pokeNames.getId(pokeName[0].toUpperCase() + pokeName.slice(1), lang);
		} catch (err) {
			return;
		}
	}
	let pokeID;
	['de', 'en', 'fr', 'ja', 'ko', 'ru'].forEach(lang => {
		let tmpID = getID(pokeName, lang);
		if (tmpID) {
			pokeID = tmpID;
		}
	});

	return pokeID;
}

function getPokeTypeURL(type) {
  const types = {
    bug: 'https://i.imgur.com/F1IRdHB.png',
    dark: 'https://i.imgur.com/7JigvbG.png',
    dragon: 'https://i.imgur.com/Hs0Ieqf.png',
    electric: 'https://i.imgur.com/F9BMA3X.png',
    fairy: 'https://i.imgur.com/OsFJezL.png',
    fighting: 'https://i.imgur.com/Flgkv6W.png',
    fire: 'https://i.imgur.com/AoHX41k.png',
    flying: 'https://i.imgur.com/01VgEio.png',
    ghost: 'https://i.imgur.com/oFama0E.png',
    grass: 'https://i.imgur.com/BcDjcY4.png',
    ground: 'https://i.imgur.com/uL8EiO3.png',
    ice: 'https://i.imgur.com/0o1xM8i.png',
    normal: 'https://i.imgur.com/aXc5igO.png',
    posion: 'https://i.imgur.com/FX1bN9S.png',
    psychic: 'https://i.imgur.com/Wir8pXG.png',
    rock: 'https://i.imgur.com/BnhjZw1.png',
    steel: 'https://i.imgur.com/MhC2Y0b.png',
    water: 'https://i.imgur.com/Pxl2ocf.png'
  }
  return types[type.toLowerCase()];
}

function convertHeight(heightString) {
  const fAndI = heightString.split("'");
  const feet = parseInt(fAndI[0]);
  const inches = parseInt(fAndI[1].replace('"', '') || '0');
  const height = convert(feet).from('ft').to('m') + convert(inches).from('in').to('m');
  return height.toFixed(1);
}

function convertWeight(weightString) {
  const weight = parseFloat(weightString.split(' lbs.')[0]);
  const kilo = convert(weight).from('lb').to('kg');
  return kilo.toFixed(1);
}

module.exports = pokedexCommand;
