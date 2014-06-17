var http = require('http');
var url = require('url');

var renderPng = function (req, res) {
  var options = url.parse(renderPng.getScreenshotPath(req));
  http.get(options, function (screenshot) {
    res.status(screenshot.statusCode);
    for (var i in screenshot.headers) {
      res.setHeader(i, screenshot.headers[i]);
    }
    screenshot.on('data', function (chunk) {
      res.write(chunk);
    });
    screenshot.on('end', function () {
      res.end();
    });
  }).on('error', function (e) {
    res.status(500);
    res.send('Got error: ' + e.message);
  });
};

if (global.config) {
  renderPng.screenshotServiceUrl = config.screenshotServiceUrl;
  renderPng.screenshotTargetUrl = config.screenshotTargetUrl;
}

renderPng.getScreenshotPath = function (req) {
  var url = req.url;
  var selector = req.query.selector || '.visualisation-inner figure';
  return [
    renderPng.screenshotServiceUrl,
    '?readyExpression=!!document.querySelector(".loaded")',
    '&forwardCacheHeaders=true',
    '&clipSelector=' + selector,
    '&url=',
    renderPng.screenshotTargetUrl,
    url.replace(/.png/g, '')
  ].join('');
};

module.exports = renderPng;
