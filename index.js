const dotenv = require('dotenv').config();
const express = require('express');

const Closure = require('./bot/closure');

if (process.env.BOT === '1') {
    console.log("Starting bot.");
    const botApp = new Closure();
    botApp.start(process.env.DISCORD_BOT_TOKEN);
}

if (process.env.SERVER === '1') {
    console.log("Starting server.");
    const server = express();
    // server section
    server.get('/', (req, res) => {
        res.send(`Test`);
    });

    server.post('/closure', (req, res) => {
        res.send('okay dokutah');
    });

    server.listen(2000, ()=> {
        console.log('Server is on at port 2000');
    });
}


// misc functions

function setDefaultChannel(guildID, channelID) {
    const configFile = JSON.parse(fs.readFileSync('./bot/closure.json'));
    configFile.defaultGuildID = guildID;
    configFile.defaultChannelID = channelID;
    fs.writeFileSync('./bot/closure.json', JSON.stringify(configFile, null, 4));
}