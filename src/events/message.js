module.exports = (client, message) => {
  const logger = client._logger;
  const config = client._config;
  const permissions = client._permissions;
  const commands = client._commands;
  if (!message.guild) {
      return;
  }

  // Check if message is a command
  if (message.author.id !== client.user.id && (message.content.startsWith(config.commandPrefix))) {
      logger.info(`Treating ${message.content} from ${message.author.username} as command`, 'Discord Client');

      let cmdTxt = message.content.split(' ')[0].substring(config.commandPrefix.length);
      let suffix = message.content.substring(cmdTxt.length + config.commandPrefix.length + 1);

      let cmd = commands[cmdTxt];
      if (cmdTxt == 'help') {
          // Help is special since it iterates over the other commands
          if (suffix) {
              // give help for given arguments
              let cmds = suffix.split(' ').filter(cmd => {
                  return commands[cmd];
              });
              let info = '';
              if(cmds.length > 0) {
                  cmds.forEach(cmdName => {
                      const currCmd = commands[cmdName];
                      info = `---------------\n**${currCmd.name}**\n`;
                      
                      let trigger = `\`\`\``;
                      if (Array.isArray(currCmd.triggers)) {
                          currCmd.triggers.forEach(t => {
                              trigger += `${config.commandPrefix}${t}\n`;
                          })
                      } else {
                          trigger += `${config.commandPrefix}${currCmd.triggers}\n`;
                      }
                      info += `${trigger}\`\`\``;

                      const usage = commands[cmdName].usage;
                      if (usage) {
                          info += `\`Arguments: ${usage}\`\n`;
                      }

                      let description = commands[cmdName].description;
                      if (description instanceof Function) {
                          description = description();
                      }
                      if (description) {
                          info += `${description}\n`;
                      }

                      info += '---------------\n\n';
                  });
              } else {
                  info = `No ** ${suffix} ** Command found`;
              }
              message.channel.send(info);
          } else {
              // Give help for all commands
              message.author.send('**Available commands:**').then(() => {
                  let batch = '';
                  let sortedCommands = Object.keys(commands).sort();
                  let commandSeen = {};
                  let filteredCommands = sortedCommands.filter(cmdName => {
                      const currCmd = commands[cmdName];
                      if(commandSeen[currCmd.name]) {
                          return false;
                      } else {
                          commandSeen[currCmd.name] = true;
                          return true;
                      }
                  });

                  filteredCommands.forEach(cmdName => {
                      const currCmd = commands[cmdName];
                      let info = `---------------\n**${currCmd.name}**\n`;
                      
                      let trigger = `\`\`\``;
                      if (Array.isArray(currCmd.triggers)) {
                          currCmd.triggers.forEach(t => {
                              trigger += `${config.commandPrefix}${t}\n`;
                          })
                      } else {
                          trigger += `${config.commandPrefix}${currCmd.triggers}\n`;
                      }
                      info += `${trigger}\`\`\``;

                      const usage = commands[cmdName].usage;
                      if (usage) {
                          info += `\`Arguments: ${usage}\`\n`;
                      }

                      let description = commands[cmdName].description;
                      if (description instanceof Function) {
                          description = description();
                      }
                      if (description) {
                          info += `${description}\n`;
                      }

                      info += '---------------\n\n';
                      const newBatch = `${batch}${info}`; 
                      if (newBatch.length > (1024 - 8)) {
                          message.author.send(batch);
                          batch = info;
                      } else {
                          batch = newBatch;
                      }
                  });

                  if (batch.length > 0) {
                      message.author.send(batch);
                  }
              });
          }
      } else if (cmd) {
          if (permissions.checkPermission(message.author, cmdTxt)) {
              const args = suffix.split(' ').filter(arg => arg !== '');
              const randomNumber = Math.floor(100 * Math.random());
              client.user.setActivity(`📈 Upgrade in progress ${randomNumber}%...`);

              if(cmd.missingArgs && args.length < 1) {
                  return message.channel.send(cmd.missingArgs);
              }
              cmd.process(client, message, args);
          } else {
              message.channel.send(`You are not allowed to run ${cmdTxt}!`);
          }
      } else {
          message.channel.send('No valid Command. Try !help');
      }
  } else if (message.author.id !== client.user.id) {
      client._monitors.forEach(monitor => {
          monitor(client, message);
      })
  }
}