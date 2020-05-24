const ytdl = require('ytdl-core');
module.exports = {
    name : 'play',
    description : 'Play Music',
    async execute(message, args, botObject) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send("You need to be in a voice channel to play music!");
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need permission to connect or speak in your voice channel");
        }

        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            title : songInfo.title,
            url : songInfo.video_url
        };
        console.log(song);

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

        
    }, play(guild, song, botObject) {
        const musicQueue = botObject.musicQueue.get(guild.id);
        if (!song) {
            musicQueue.voiceChannel.leave();
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
    }

}