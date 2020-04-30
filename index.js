const Discord = require('discord.js');
const dotenv = require('dotenv').config();
const fs = require('fs');


const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

for (const file of commandFiles) {
    const command = require(`./bot/commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', msg => {
    if (!msg.content.startsWith('^') || msg.author.bot) return;

    const args = msg.content.slice(1).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(`Error in executing "${command}" command!`);
        msg.reply(`There is an error on that command, Doctor!\nCheck your server log.`);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);