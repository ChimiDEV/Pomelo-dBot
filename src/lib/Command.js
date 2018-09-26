class Command {
/**
 * Forces specified Structur on commands
 * @param {{name:string, triggers:string|array, description:string|function, usage:string, missingArgs:string, process:fucntion}} meta 
 */
  constructor({name, triggers, description, usage, missingArgs, process}) {
    this.name = name;
    this.triggers = triggers;
    this.description = description;
    this.usage = usage;
    if (missingArgs) {
      this.missingArgs = missingArgs;
    }
    if(process) {
      this.process = process;
    }
  }
  
  setProcess(process) {
    this.process = process;
  }
}

module.exports = Command
