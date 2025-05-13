import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.loadCommands();
  }

  async loadCommands() {
    const commandFiles = await fs.readdir(__dirname);

    for (const file of commandFiles) {
      if (file.endsWith('.js') && file !== 'CommandHandler.js' && file !== 'Command.js') {
        try {
          const commandModule = await import(path.join(__dirname, file));
          const command = new commandModule.default();
          this.commands.set(command.name, command);
        } catch (error) {
          console.error(`❌ Error cargando el comando ${file}:`, error);
        }
      }
    }
    this.commands.set('help', new (await import('./HelpCommand.js')).default(this.commands));
  }

  async handleCommand(msg) {
    const prefix = '!';
  
    // Verificar que se recibe el mensaje correctamente
    console.log(`Mensaje recibido: ${msg.content}`);
  
    // Verificar que el mensaje tiene el prefijo correcto y no es de un bot
    if (!msg.content.startsWith(prefix)) return;
    if (msg.author.bot) return;
  
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    console.log(`Comando detectado: ${commandName}`); // Ver el comando detectado
  
    if (!this.commands.has(commandName)) return;
  
    const command = this.commands.get(commandName);
  
    try {
      console.log(`Ejecutando el comando ${commandName}...`); // Confirmar ejecución del comando
      await command.execute({ message: msg, args });
    } catch (error) {
      console.error('❌ Error al ejecutar el comando:', error);
      await msg.channel.send('Ocurrió un error al intentar ejecutar el comando.');
    }
  }
}
