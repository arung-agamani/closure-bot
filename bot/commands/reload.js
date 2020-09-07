module.exports = {
    name : 'reload',
    execute(message, args, botObject) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            botObject.reload_REQUIRE().then(() => {
                message.channel.send('Hot reloading success!');
            }).catch(() => {
                message.channel.send('Hot reloading failed :(');
            });
        } else {
            message.channel.send("You're not an administrator");
        }
    }
}