const inventory = require('./inventory');
const logger = require('./logger');

module.exports = client => {
  client._util = {};
  inventory(client);
  logger(client);
}