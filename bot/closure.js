const Discord = require('discord.js');
const MessageEmbed = require('discord.js').MessageEmbed;
const fs = require('fs');

class Closure {
    constructor() {
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
    }

    start(token) {
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });
        for (const file of this.commandFiles) {
            const command = require(`./commands/${file}`);
            this.client.commands.set(command.name, command);
        }
        this.client.on('message', msg => {
            if (!msg.content.startsWith('^') || msg.author.bot) return;
        
            const args = msg.content.slice(1).split(/ +/);
            const command = args.shift().toLowerCase();
            console.log(command);
            if (!this.client.commands.has(command)) return;
        
            try {
                this.client.commands.get(command).execute(msg, args);
            } catch (error) {
                console.error(`Error in executing "${command}" command!`);
                msg.reply(`There is an error on that command, Doctor!\nCheck your server log.`);
            }
        });
        this.client.login(token);
    }

    sendGithubEmbed(jsonData) {
        // console.log(jsonData);
        // const embedMessage = new MessageEmbed();
        // const commits = jsonData.commits;
        
        // embedMessage
        //     .setTitle("New Github Push Event!")
        //     .setDescription(`Showing up to ${commits.length} commits.`)
        //     .setThumbnail(jsonData.sender.avatar_url)
        //     .addField("Pusher", jsonData.pusher.name);
        // for (const commit of commits) {
        //     embedMessage.addField("Commit message", commit.message);
        // }
        this.client
            .guilds.cache.get('339763195554299904')
            .channels.cache.get('705468600340709418')
            .send(require('./embedMessage').getEmbed(jsonData));
    }
}

module.exports = Closure;