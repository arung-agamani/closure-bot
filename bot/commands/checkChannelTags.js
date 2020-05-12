module.exports = {
    name : 'checktags',
    description : 'Ping Pong!',
    execute(message, args, botObject) {
        // botObject.log("This message was sent from registerChannel.js");
        botObject.checkChannelTags(message.guild.id, message.channel.id, result => {
            let tags = [];
            for (const row of result.values) {
                tags.push(row.tags);
            }
            message.channel.send("Tags for this channel : " + tags.toString());
        })
    }
}