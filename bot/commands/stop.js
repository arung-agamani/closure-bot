module.exports = {
    name : 'stop',
    description : 'Stop playing music!',
    execute(message, args, botObject) {
        if (!message.member.voice.channel) {
            return message.channel.send("You have to be in voice channel to use this command");
        }
        botObject.musicQueue.get(message.guild.id).songs = [];
        botObject.musicQueue.get(message.guild.id).connection.dispatcher.end();
    }
}