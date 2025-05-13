export default class Command {
    constructor(name, description) {
      this.name = name;
      this.description = description;
      this.cooldown = 3000; // Tiempo de espera entre usos (ms)
    }
  
    async execute(msg, args) {
      throw new Error('This method should be implemented by subclasses.');
    }
  }
  