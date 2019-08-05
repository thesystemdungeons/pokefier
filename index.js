// Pokefier base src
// Require modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const crypto = require('crypto');
const fetch = require('snekfetch');
const config = require('./config.json');
// Load database
const hash = JSON.parse(fs.readFileSync('./data/hash.json', 'utf8'));
// Program start
client.identify = imageRecognition = (client, message, blob) => {
    try {
        let pokemon = crypto.createHash('md5').update(blob).digest('hex');
        let name = hash[pokemon];
        if (name) {
            // Pokemon exists in database
            client.user.setActivity(`A wild ${name} appeard!`, { type: 'WATCHING' });
        } else {
            // Missingno! Console hash if pokemon hash doesnt exist in database
            console.warn(`Missingno hash: ${pokemon}`);
        }
    } catch (err) {
        console.warn(`client's image recognition encountered an error: ${err}`);
    }
};
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} in ${client.guilds.size} servers!`);
});
client.on('message', (message) => {
    // Pokecord Embeds
    if (Array.isArray(message.embeds) && message.embeds.length >= 1 && message.author.id === config.pokecord.id) {
        let embed = message.embeds[0];
        // Spawns
        if (embed.title && ~embed.title.indexOf('wild pokémon has appeared!')) {
            // Image URL
            if (embed.image && embed.image.proxyURL) {
                fetch.get(embed.image.proxyURL).then(res => {
                    // console.log(res.body);
                    client.identify(client, message, res.body);
                }).catch(O_o=>{});
            }
            // Thumbnail URL
            if (embed.thumbnail && embed.thumbnail.proxyURL) {
                fetch.get(embed.thumbnail.proxyURL).then(res => {
                    // console.log(res.body);
                    client.identify(client, message, res.body);
                }).catch(O_o=>{});
            }
        }
    }      
});
client.on('warn', (info) => { console.warn(`warn: ${info}`); });
client.on('error', (error) => { console.error(`client's WebSocket encountered a connection error: ${error}`); });
client.on('disconnect', () => { console.warn('Disconnected!'); });
client.on('reconnecting', () => { console.warn('Reconnecting...'); });
client.on('resume', (replayed) => { console.log(`client's WebSocket resumes, ${replayed} replays`); });
client.login(config.token);