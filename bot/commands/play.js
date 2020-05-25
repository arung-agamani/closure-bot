const ytdl = require('ytdl-core');
const yts = require('yt-search');
const embedMessage = require('discord.js').MessageEmbed;
const searchingUser = new Map();
module.exports = {
    name : 'play',
    description : 'Play Music',
    async execute(message, args, botObject) {
        const ytRegex = new RegExp(/^https:\/\/.*\.youtube\.com\/watch\?v=.*$/);
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send("You need to be in a voice channel to play music!");
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need permission to connect or speak in your voice channel");
        }
        const song = { title : '', url : '', length : 0};

        if (args[0].match(ytRegex)) {
            const songInfo = await ytdl.getInfo(args[0]);
            song = {
                title : songInfo.title,
                url : songInfo.video_url,
                length : songInfo.length_seconds
            };
            this.enqueue(message, args, botObject, song);
        } else {
            this.search(message, args, botObject);
        }     
    }, play(guild, song, botObject) {
        const musicQueue = botObject.musicQueue.get(guild.id);
        if (!song) {
            musicQueue.voiceChannel.leave();
            musicQueue.textChannel.send('No music in playlist. Aight, Imma head out.');
            botObject.musicQueue.delete(guild.id);
            return;
        }
        const dispatcher = musicQueue.connection
            .play(ytdl(song.url, {
                quality : 'highestaudio'
            }))
            .on('finish', () => {
                musicQueue.songs.shift();
                this.play(guild, musicQueue.songs[0], botObject);
            })
            .on('error', error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(musicQueue.volume / 5);
        musicQueue.textChannel.send(`Start playing **${song.title}**`);
    }, async search(message, args, botObject) {
        const queryString = args.join(' ');
        console.log(queryString);
        // check if user has asked before
        if (searchingUser.has(message.author.id) && args.length == 1) {
            // determine which one to be played
            if (isNaN(args[0])) {
                message.channel.send('You must response with valid number (between 1 and 5)');
            } else if (!isNaN(args[0])) {
                const idxChoice = parseInt(args[0]) - 1;
                const videos = searchingUser.get(message.author.id);
                const song = { title : '', url : '', length : 0};
                song.title = videos[idxChoice].title;
                song.url = videos[idxChoice].url;
                song.length = videos[idxChoice].length;
                searchingUser.delete(message.author.id);
                message.channel.send(`Choosing item ${idxChoice+1}: **${song.title}**`);
                this.enqueue(message, args, botObject, song);
            }
        } else {
            // create new context
            // save context
            const context = {
                textChannel : message.channel.id,
                user : message.author.id,
                context : 'music-yt-search'
            };
            const searchResult = await yts(queryString);
            const videos = searchResult.videos.slice(0,6);
            const responseEmbedMessage = new embedMessage();
            responseEmbedMessage.setTitle(`Showing top ${videos.length} search result!`);
            responseEmbedMessage.setDescription(`Reply this message using %^play <your number of choice>`);
            for (let i = 0; i < videos.length; i++) {
                responseEmbedMessage.addField(`${i + 1}. ${videos[i].title} **${videos[i].duration}**`, videos[i].url);
            }
            searchingUser.set(message.author.id, videos);
            //console.log('Search result returns ' + videos.length + ' items');
            message.channel.send(responseEmbedMessage);
        }
        
    }, async enqueue(message, args, botObject, song) {
        const voiceChannel = message.member.voice.channel;
        console.log(song);
        // const songInfo = await ytdl.getInfo(song.url);
        

        if (!botObject.musicQueue.get(message.guild.id)) {
            const queueConstruct = {
                textChannel : message.channel,
                voiceChannel : voiceChannel,
                connection : null,
                songs : [],
                volume: 5,
                playing : true
            };
            botObject.musicQueue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
    
            try {
                let connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                this.play(message.guild, queueConstruct.songs[0], botObject);
            } catch (err) {
                console.error(err.message);
                botObject.musicQueue.delete(message.guild.id);
                return message.channel.send(err.message);
            }
        } else {
            botObject.musicQueue.get(message.guild.id).songs.push(song);
            console.log(botObject.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
    }

}