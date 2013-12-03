define([
  'winston'
],
function (winston) {
  var logger = new (winston.Logger)({
    transports: [
      // In development we log debug messages to the console by default
      new (winston.transports.Console)({
        level: 'debug',
        colorize: true
      })
    ]
  });

  return logger;
});
