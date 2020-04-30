module.exports = {
    name : 'isadmin',
    execute(message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send("You're the administrator.");
        } else {
            message.channel.send("You're not an administrator");
        }
    }
}