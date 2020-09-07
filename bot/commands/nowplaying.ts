import * as ClosureType from '../closure';
import { Message, TextChannel, VoiceChannel, VoiceConnection, MessageEmbed as DEmbed } from 'discord.js';

export const name = 'np';
export const description = 'Now Playing command'
export interface MusicQueue {
    textChannel: TextChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    songs: SongInfo[];
    playing: boolean;
    currentlyPlaying: number;
}
export interface SongInfo {
    title: string;
    url: string;
    length: number;
}

export function execute(message: Message, args: Array<string>, botObject: ClosureType.default) {
    const musicQueue: MusicQueue = botObject.musicQueue.get(message.guild.id);
    const NowPlayingEmbed = new DEmbed().setTitle('Closure\'s Now Playing Queue');
    NowPlayingEmbed.setDescription(`Showing queue of ${musicQueue.songs.length} items`);
    for (let i = 0; i < musicQueue.songs.length; i++) {
        if (i === musicQueue.currentlyPlaying) {
            NowPlayingEmbed.addField(`**${i+1}. ${musicQueue.songs[i].title}**`, musicQueue.songs[i].url);
        } else {
            NowPlayingEmbed.addField(`${i+1}. ${musicQueue.songs[i].title}`, musicQueue.songs[i].url);
        }
    }
    NowPlayingEmbed.addField(`Currently playing on ${musicQueue.currentlyPlaying+1}`, musicQueue.songs[musicQueue.currentlyPlaying].title);
    message.channel.send(NowPlayingEmbed);
};