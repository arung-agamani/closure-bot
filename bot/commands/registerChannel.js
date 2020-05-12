module.exports = {
    name : 'registerchannel',
    description : 'Ping Pong!',
    execute(message, args, botObject) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            botObject.registerChannel(message.guild.id, message.channel.id, message.author.id, args, result => {
                if (result.status == 0) {
                    message.channel.send("Something is wrong while registering.\nError message : " + result.message);
                } else {
                    message.channel.send("Successfully registering this channel!")
                }
            });
        } else {
            message.channel.send("You dont have the authority for this. Contact server admin.");
        }
        
    }
}