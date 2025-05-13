import Command from './Command.js';
import { EmbedBuilder } from 'discord.js';

export default class PingCommand extends Command {
    constructor() {
        super('ping', 'Responde con Pong!');
    }

    async execute(msg, args) {
        await msg.channel.send('Pong!');
    }
}
