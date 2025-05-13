import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import CommandHandler from './commands/CommandHandler.js';
import http from 'http'; // Importa el módulo http

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const handler = new CommandHandler(client);

// ✅ Bloque para el bot
client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

client.on('error', (error) => {
  console.error('Error en el cliente de Discord:', error);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  handler.handleCommand(message);
});

client.login(process.env.DISCORD_BOT_TOKEN);

// 🧑‍💻 Agrega esto para el health check
const port = process.env.PORT || 8000; // Usa el puerto 8000 para el health check
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running\n'); // Respuesta del servidor
}).listen(port, () => {
  console.log(`Health check server listening on port ${port}`);
});
