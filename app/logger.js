var winston = require('winston-alphagov');

module.exports = new (winston.Logger)({
  transports: [
    // In development we log debug messages to the console by default
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true
    })
  ]
});