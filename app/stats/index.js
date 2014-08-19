var morgan  = require('morgan');

var StatsD = require('node-statsd').StatsD;
var client = new StatsD({
  prefix: global.config.statsdPrefix || ''
});

var stats = {
  loadtime: require('./load-time')
};

module.exports = morgan(function (mgn, req, res) {
  stats.loadtime(mgn, req, res, client);
});