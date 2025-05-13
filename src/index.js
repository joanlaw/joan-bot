import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import CommandHandler from './commands/CommandHandler.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const handler = new CommandHandler(client);

// ✅ Aquí va este bloque:
client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

client.on('error', (error) => {
  console.error('Error en el cliente de Discord:', error);
});
// ⬆️ Fin del bloque

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  handler.handleCommand(message);
});

client.login(process.env.DISCORD_BOT_TOKEN);
