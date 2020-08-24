const DEmbed = require('discord.js').MessageEmbed;

const BaseEmbedMessage = new DEmbed()
                            .setTitle('Closure Youtube to MP3 Downloader')
                            .addField('Download Status', 'Downloading...');

const ConversionEmbed = new DEmbed()
                            .setTitle('Closure Youtube to MP3 Downloader')
                            .addField('Download Status', 'Downloaded!')
                            .addField('Conversion Status', 'Converting...');

const FinalEmbed = new DEmbed()
                        .setTitle('Closure Youtube to MP3 Downloader')
                        .addField('Download Status', 'Downloaded!')
                        .addField('Conversion Status', 'Converted!')
                        .addField('File Serving', 'Here is your file [insert file url here]');


module.exports = {
    name : 'em',
    execute(message, args, botObject) {
        message.channel.send(BaseEmbedMessage).then(msg => {
            setTimeout(() => {
                msg.edit(ConversionEmbed).then(msg => {
                    setTimeout(() => {
                        msg.edit(FinalEmbed);
                    }, 1000);
                }, 1000);
            })
        })
    }
}