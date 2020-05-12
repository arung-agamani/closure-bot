module.exports = {
    name : 'publish',
    description : 'Ping Pong!',
    execute(message, args, botObject) {
        // botObject.log("This message was sent from registerChannel.js");
        botObject.publishEvent(message.guild.id, args[0]);
    }
}