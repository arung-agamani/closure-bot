import * as ClosureType from '../closure';
import { Message } from 'discord.js';

export const name = 'thiss';
export const description = 'Ping Pong!'

function callableFunc() {
    return "This just edited and called from another func\nFuck aaaaa";
}

export function execute(message: Message, args: Array<string>, botObject: ClosureType.default) {
    message.channel.send('hissssssss\n' + callableFunc());
};