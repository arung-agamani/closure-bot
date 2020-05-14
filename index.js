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
        res.json({status : 200});
    });

    server.post('/warfarin', (req, res) => {
        console.log(req.body);
        
        if (req.body.requestOrigin == "Twitter") {
            let urlObject = new URL(req.body.pageUrl);
            //console.log(urlObject);
            let twitterUrl = new URL(req.body.linkUrl);
            let origin = twitterUrl.origin;
            let paths = twitterUrl.pathname.split('/');
            let path = paths.slice(0, paths.length - 2).join('/');
            botApp.publishLink('339763195554299904', req.body.tag, origin + path);
        } else if (req.body.requestOrigin == "Facebook") {
            let urlObject = new URL(req.body.pageUrl);
            console.log(urlObject.href);
        } else if (req.body.requestOrigin.match(/pixiv/i)) {
            if (req.body.value.linkUrl.match(/pximg/i)) {
                // this is a right click on image
                botApp.publishLink('339763195554299904', req.body.tag, req.body.value.pageUrl);
            } else if (req.body.value.linkUrl.match(/pixiv\.net/i)) {
                // this is a right click on image thumbnail to another artwork
                botApp.publishLink('339763195554299904', req.body.tag, req.body.value.linkUrl);
            }
            // botApp.publishLink('339763195554299904', req.body.tag, req.body.value.pageUrl);
        }
        // botApp.publishLink('339763195554299904', req.body.tag, urlObject.href);
        res.send('POST Request 200');
    });

    server.get('/warfarin', (req, res) => {
        res.send("GET Request 200")
    });

    server.get('/warfarin/:guild_id/tags', (req, res) => {
        botApp.getGuildTags(req.params.guild_id, retval => {
            if (retval.status === 200) {
                res.json(retval);
            } else {
                res.status(400).send(retval.message);
            }
        })
    })

    server.post('/test', (req, res) => {
        if (req.headers['x-github-event'] != undefined) {
            res.json({status : 'from github'});
        } else {
            res.json({status : 404});
        }
    })

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