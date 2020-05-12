const Discord = require('discord.js');
const MessageEmbed = require('discord.js').MessageEmbed;
const fs = require('fs');
const path = require('path');
const embedMessage = require('./embedMessage');
const sqlite = require('sqlite3');

class Closure {
    constructor() {
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
        this.isDatabaseReady = false;
        this.db = new sqlite.Database(path.resolve(__dirname, 'database', 'warfarin.db'), (err) => {
            if (err) {
                return console.error(err.message);
            } else {
                console.log("Bot connected to database!");
                this.isDatabaseReady = true;
            }
        })
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
            if (!msg.content.startsWith('%^') || msg.author.bot) return;
        
            const args = msg.content.slice(2).split(/ +/);
            const command = args.shift().toLowerCase();
            if (!this.client.commands.has(command)) return;
        
            try {
                this.client.commands.get(command).execute(msg, args, this);
            } catch (error) {
                console.error(`Error in executing "${command}" command!`);
                msg.reply(`There is an error on that command, Doctor!\nCheck your server log.`);
            }
        });
        this.client.login(token);
    }

    log(text) {
        console.log(text);
    }

    sendGithubEmbed(jsonData) {
        console.log(`Embed message sent to
        Guild:  339763195554299904
        Channel : 705468600340709418`);
        this.client
            .guilds.cache.get('339763195554299904')
            .channels.cache.get('705468600340709418')
            .send(embedMessage.getEmbed(jsonData));
    }

    warfarinExtensionHandler(jsonData) {
        // check database for channel mapping.
    }

    registerChannel(guild_id, channel_id, registrar, tags, callback) {
        // check if guild__id and channel_id exists in Guild_Channel table
        if (tags == '' || tags === undefined) {
            callback({
                status : 0,
                message : "Provide a tag"
            });
            return;
        }
        console.log("Searching for guild_id and channel_id in database...");
        this.db.get(`SELECT * FROM Guild_Channel WHERE
        guild_id="${guild_id}" AND 
        channel_id="${channel_id}";`, (err, row) => {
            if (err) {
                console.error(err.message);
                callback({
                    status : 0,
                    message : err.message
                });
            } else {
                let values = '';
                for (let i = 0; i < tags.length; i++) {
                    if (i != tags.length-1) {
                        values += `("${channel_id}", "${tags[i]}", "${registrar}"),`
                    } else {
                        values += `("${channel_id}", "${tags[i]}", "${registrar}");`
                    }
                }
                if (row) {
                    console.log(row);
                    console.log("guild_id and channel_id exists!\nProceeding to add channel and tags to Channel_Tags");
                            this.db.run(`INSERT INTO Channel_Tags 
                            VALUES${values};`, (err3) => {
                                if (err3) {
                                    console.error(err3.message);
                                    callback({
                                        status : 0,
                                        message : err3.message
                                    });
                                } else {
                                    console.log(`${guild_id}:${channel_id}:${tags} added.`);
                                    callback({
                                        status : 1,
                                        message : "Successfully registering this tag to this channel"
                                    });
                                }
                            })
                } else {
                    console.log("guild_id and channel_id not found. Adding new record to Guild_Channel");
                    
                    this.db.run(`INSERT INTO Guild_Channel 
                    VALUES("${guild_id}", "${channel_id}", "${registrar}");`, (err2) => {
                        if (err2) {
                            console.error(err2.message);
                            callback({
                                status : 0,
                                message : err2.message
                            });
                        } else {
                            console.log("guild_id and channel_id added!\nProceeding to add channel and tags to Channel_Tags");
                            this.db.run(`INSERT INTO Channel_Tags 
                            VALUES${values};`, (err3) => {
                                if (err3) {
                                    console.error(err3.message);
                                    callback({
                                        status : 0,
                                        message : err3.message
                                    });
                                } else {
                                    console.log(`${guild_id}:${channel_id}:${tags} added.`);
                                    callback({
                                        status : 1,
                                        message : "Successfully registering this tag to this channel"
                                    });
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    deleteTag(guild_id, channel_id, tags, callback) {
        this.db.run(`DELETE FROM Channel_Tags WHERE channel_id="${channel_id}" 
        AND tags="${tags}";`, (err) => {
            if (err) {
                console.error(err.message);
                callback({
                    status : 0,
                    message : err.message
                });
            } else {
                console.log("Successfully delete tag " + tags + " from " + channel_id);
                callback({
                    status : 1,
                    message : `Successfully deleted tag ${tags} from ${channel_id}`
                });
            }
        })
    }

    checkChannelTags(guild_id, channel_id, callback) {
        this.db.all(`SELECT g.guild_id, c.channel_id, c.tags FROM Guild_Channel as g, Channel_Tags as c WHERE 
        g.guild_id="${guild_id}" AND g.channel_id="${channel_id}" 
        AND g.channel_id=c.channel_id;`, (err, rows) => {
            if (err) {
                console.error(err.message);
                callback({
                    status : 0,
                    message : err.message
                });
            } else {
                console.log("Fetched all the tags for channel : " + channel_id);
                callback({
                    status : 1,
                    message : "Fetching successful.",
                    values : rows
                });
            }
        })
    }

    publishEvent(guild_id, tag) {
        this.db.all(`SELECT g.channel_id FROM Guild_Channel as g, Channel_Tags as c 
        WHERE g.guild_id="${guild_id}" AND g.channel_id=c.channel_id AND c.tags="${tag}";`, (err, rows) => {
            for (const row of rows) {
                this.client
                .guilds.cache.get(guild_id)
                .channels.cache.get(row.channel_id)
                .send("Event broadcasted to this channel because of tag " + tag);
            }
        })
    }

    publishLink(guild_id, tag, link) {
        this.db.all(`SELECT g.channel_id FROM Guild_Channel as g, Channel_Tags as c 
        WHERE g.guild_id="${guild_id}" AND g.channel_id=c.channel_id AND c.tags="${tag}";`, (err, rows) => {
            for (const row of rows) {
                this.client
                .guilds.cache.get(guild_id)
                .channels.cache.get(row.channel_id)
                .send(link);
            }
        });
    }
}

module.exports = Closure;