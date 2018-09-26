module.exports = client => {
  client._logger.info('Disconnected!', 'discordClient');
  process.exit(1);
}