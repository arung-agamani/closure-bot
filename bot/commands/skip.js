module.exports = {
    name : 'skip',
    description : 'Skip currently playing music!',
    execute(message, args, botObject) {
        if (!message.member.voice.channel) {
            return message.channel.send("You have to be in voice channel to use this command");
        }
        if (!botObject.musicQueue) {
            return message.channel.send("Nothing played, nothing to skip :D");
        }
        botObject.musicQueue.get(message.guild.id).connection.dispatcher.end();
    }
}