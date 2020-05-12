const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    getEmbed(jsonData) {
        const commits = jsonData.commits;
        const ref = jsonData.ref.split('/');
        const embedMessage = new MessageEmbed();
        embedMessage
            .setTitle(`New Github Push Event to branch [${ref[ref.length-1]}](${jsonData.repository.html_url+'/tree/'+ref[ref.length-1]})`)
            .setDescription(`Showing up to ${commits.length} commits.\nRepository url [here](${jsonData.repository.html_url})`)
            .setThumbnail(jsonData.sender.avatar_url)
            .addField("Pusher", jsonData.pusher.name)
        for (const commit of commits) {
            embedMessage.addField("Commit message", commit.message + `\n[Commit URL here](${commit.url})`);
            let additionString = "```";
            let removedString = "```";
            let modifiedString = "```";
            for (const addedFile of commit.added) {
                additionString += addedFile;
                additionString += '\n';
            }
            for (const removedFile of commit.removed) {
                removedString += removedFile;
                removedString += '\n';
            }
            for (const modifiedFile of commit.modified) {
                modifiedString += modifiedFile;
                modifiedString += '\n';
            }
            additionString += "```";
            removedString += "```";
            modifiedString += "```";
            if (additionString !== "``````") {
                embedMessage.addField("Addition", additionString, true);
            }
            if (removedString !== "``````") {
                embedMessage.addField("Removed", removedString, true);
            }                
            if (modifiedString !== "``````") {
                embedMessage.addField("Modified", modifiedString, true);
            }
        }
        // console.log(embedMessage.toJSON());
        return embedMessage;
    }
}