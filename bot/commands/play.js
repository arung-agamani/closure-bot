const ytdl = require('ytdl-core');
const yts = require('yt-search');
const embedMessage = require('discord.js').MessageEmbed;

const searchingUser = new Map();
module.exports = {
  name: 'play',
  description: 'Play Music',
  async execute(message, args, botObject) {
    const ytRegex = new RegExp(/^https:\/\/.*\.youtube\.com\/watch\?v=.*$/);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send(
        'You need to be in a voice channel to play music!'
      );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send(
        'I need permission to connect or speak in your voice channel'
      );
    }
    const song = { title: '', url: '', length: 0 };

    if (args[0].match(ytRegex)) {
      const songInfo = await ytdl.getInfo(args[0]);
      song.title = songInfo.title;
      song.url = songInfo.video_url;
      song.length = songInfo.length_seconds;
      this.enqueue(message, args, botObject, song);
    } else {
      this.search(message, args, botObject);
    }
  },
  play(guild, song, botObject) {
    const musicQueue = botObject.musicQueue.get(guild.id);
    if (musicQueue.currentlyPlaying >= musicQueue.songs.length) {
      musicQueue.voiceChannel.leave();
      musicQueue.textChannel.send(
        'Reached the end in playlist. Aight, Imma head out.'
      );
      botObject.musicQueue.delete(guild.id);
      return;
    }
    const dispatcher = musicQueue.connection
      .play(
        ytdl(song.url, {
          quality: 'highestaudio',
          highWaterMark: 1 << 25,
        })
      )
      .on('finish', () => {
        // musicQueue.songs.shift();
        musicQueue.currentlyPlaying++;
        this.play(
          guild,
          musicQueue.songs[musicQueue.currentlyPlaying],
          botObject
        );
      })
      .on('error', (error) => {
        console.error(error);
      });
    dispatcher.setVolumeLogarithmic(musicQueue.volume / 5);
    musicQueue.textChannel.send(`Start playing **${song.title}**`);
  },
  async search(message, args, botObject) {
    const queryString = args.join(' ');
    console.log(queryString);
    // check if user has asked before
    if (searchingUser.has(message.author.id) && args.length == 1) {
      // determine which one to be played
      if (isNaN(args[0])) {
        message.channel.send(
          'You must response with valid number (between 1 and 5)'
        );
      } else if (!isNaN(args[0])) {
        const idxChoice = parseInt(args[0]) - 1;
        const videos = searchingUser.get(message.author.id);
        const song = { title: '', url: '', length: 0 };
        song.title = videos[idxChoice].title;
        song.url = videos[idxChoice].url;
        song.length = videos[idxChoice].length;
        searchingUser.delete(message.author.id);
        message.channel.send(
          `Choosing item ${idxChoice + 1}: **${song.title}**`
        );
        this.enqueue(message, args, botObject, song);
      }
    } else {
      // create new context
      // save context
      const context = {
        textChannel: message.channel.id,
        user: message.author.id,
        context: 'music-yt-search',
      };
      console.log('searching:', queryString);
      const searchResult = await yts(queryString);
      const videos = searchResult.videos.slice(0, 6);
      const responseEmbedMessage = new embedMessage();
      responseEmbedMessage.setTitle(
        `Showing top ${videos.length} search result!`
      );
      responseEmbedMessage.setDescription(
        `Reply this message using %^play <your number of choice> or by reacting in 30 seconds `
      );
      for (let i = 0; i < videos.length; i++) {
        responseEmbedMessage.addField(
          `${i + 1}. ${videos[i].title} **${videos[i].duration}**`,
          videos[i].url
        );
      }
      searchingUser.set(message.author.id, videos);
      // console.log('Search result returns ' + videos.length + ' items');
      let msgChoosePtr = null;
      message.channel
        .send(responseEmbedMessage)
        .then((msg) => {
          msg.react('1⃣');
          msgChoosePtr = msg;
        })
        .then(() => {
          msgChoosePtr.react('2⃣');
        })
        .then(() => {
          msgChoosePtr.react('3⃣');
        })
        .then(() => {
          msgChoosePtr.react('4⃣');
        })
        .then(() => {
          msgChoosePtr.react('5⃣');
        })
        .then(() => {
          msgChoosePtr.react('6⃣');
        })
        .then(() => {
          msgChoosePtr
            .awaitReactions(
              (reaction, user) => {
                // console.log(reaction.emoji);
                if (user.id !== message.author.id) {
                  return false;
                }
                if (
                  reaction.emoji.name === '1⃣' ||
                  reaction.emoji.name === '2⃣' ||
                  reaction.emoji.name === '3⃣' ||
                  reaction.emoji.name === '4⃣' ||
                  reaction.emoji.name === '5⃣' ||
                  reaction.emoji.name === '6⃣'
                ) {
                  // console.log('Valid user and reaction target')
                  return true;
                }
                return false;
              },
              { max: 1, time: 30000, errors: ['time'] }
            )
            .then((collected) => {
              const reaction = collected.first();
              let choosenIndex = null;
              switch (reaction.emoji.name) {
                case '1⃣':
                  choosenIndex = 1;
                  break;
                case '2⃣':
                  choosenIndex = 2;
                  break;
                case '3⃣':
                  choosenIndex = 3;
                  break;
                case '4⃣':
                  choosenIndex = 4;
                  break;
                case '5⃣':
                  choosenIndex = 5;
                  break;
                case '6⃣':
                  choosenIndex = 6;
                  break;
                default:
                  break;
              }
              // eslint-disable-next-line no-empty
              if (choosenIndex === null) {
              } else {
                const idxChoice = choosenIndex - 1;
                const videos = searchingUser.get(message.author.id);
                const song = { title: '', url: '', length: 0 };
                song.title = videos[idxChoice].title;
                song.url = videos[idxChoice].url;
                song.length = videos[idxChoice].length;
                searchingUser.delete(message.author.id);
                message.channel.send(
                  `Choosing item ${idxChoice + 1}: **${song.title}**`
                );
                this.enqueue(message, args, botObject, song);
              }
            })
            .catch((collected) => {
              searchingUser.delete(message.author.id);
              // message.channel.send(`Timed out. Try again.`);
            });
        });
    }
  },
  async enqueue(message, args, botObject, song) {
    const voiceChannel = message.member.voice.channel;
    console.log(song);
    // const songInfo = await ytdl.getInfo(song.url);

    if (!botObject.musicQueue.get(message.guild.id)) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        currentlyPlaying: 0,
      };
      botObject.musicQueue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
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
  },
};
