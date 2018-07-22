const exitCommand = {
    name: 'exit',
    module: {
        description: 'Command to log out bot',
        process: (client, msg, suffix) => {
            process.exit(0);
        }
    }
}


module.exports = exitCommand;