module.exports = function (morgan, req, res, statsd) {
  if (req['spotlight-dashboard-slug']) {
    var responseTime = morgan['response-time'](req, res);
    statsd.timing('.response_time', responseTime);
    statsd.timing('.dashboards.' + req['spotlight-dashboard-slug'] + '.response_time', responseTime);
  }
};