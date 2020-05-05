const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const Closure = require('./bot/closure');
const botApp = new Closure();

if (process.env.BOT === '1') {
    console.log("Starting bot.");
    botApp.start(process.env.DISCORD_BOT_TOKEN);
}

if (process.env.SERVER === '1') {
    console.log("Starting server.");
    const server = express();
    server.use(bodyParser.json());
    // server section
    server.get('/', (req, res) => {
        res.send(`Test`);
        botApp.sendGithubEmbed(JSON.parse(require('fs').readFileSync('./bot/sample.json').toString()));
    });

    server.post('/closure', (req, res) => {
        // res.send('okay dokutah');
        botApp.sendGithubEmbed(req.body);
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