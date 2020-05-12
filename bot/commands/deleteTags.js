module.exports = {
    name : 'deletetag',
    description : 'Ping Pong!',
    execute(message, args, botObject) {
        // botObject.log("This message was sent from registerChannel.js");
        botObject.deleteTag(message.guild.id, message.channel.id, args[0], result => {
            message.channel.send("Tag " + args[0] + " deleted from this channel.");
        })
    }
}