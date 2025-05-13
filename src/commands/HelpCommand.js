import Command from './Command.js';

export default class HelpCommand extends Command {
  constructor(commands) {
    super('help', 'Muestra la lista de comandos disponibles.');
    this.commands = commands;
  }

  async execute({ message }) {
    let reply = '**🛠 Lista de Comandos Disponibles:**\n\n';
    for (const cmd of this.commands.values()) {
      reply += `• **!${cmd.name}**: ${cmd.description}\n`;
    }
    await message.reply(reply);
  }
}
