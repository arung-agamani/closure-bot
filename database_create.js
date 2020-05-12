const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('./bot/database/warfarin.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to file database at ./bot/database/warfarin.db");
});

function createGuildChannelTable() {
    db.run(`CREATE TABLE Guild_Channel (
        guild_id varchar(24) not null,
        channel_id varchar(24) not null,
        registrar varchar(24) not null,
        PRIMARY KEY (guild_id, channel_id)
    );`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Guild_Channel table created!");
    })
}

function createChannelTagsTable() {
    db.run(`CREATE TABLE Channel_Tags (
        channel_id varchar(24) not null,
        tags varchar(24) not null,
        registrar varchar(24) not null,
        PRIMARY KEY (channel_id, tags),
        FOREIGN KEY (channel_id) REFERENCES Guild_Channel(channel_id)
    );`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Guild_Channel table created!");
    });
}