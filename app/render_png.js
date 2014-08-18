var http = require('http');
var url = require('url');

var requirejs = require('requirejs');

var ErrorController = require('./server/controllers/error');
var Model = requirejs('extensions/models/model');
var PageConfig = requirejs('page_config');

var renderPng = function (req, res) {
  var options = url.parse(renderPng.getScreenshotPath(req));
  http.get(options, function (screenshot) {
    if (screenshot.statusCode > 399) {
      return renderError(screenshot.statusCode, req, res);
    } else {
      res.status(screenshot.statusCode);
      for (var i in screenshot.headers) {
        res.setHeader(i, screenshot.headers[i]);
      }
      screenshot.pipe(res);
    }
  }).on('error', function () {
    renderError(500, req, res);
  });
};

var renderError = function (status, req, res) {
  var model = new Model({
    status: status || 500
  });
  model.set(PageConfig.commonConfig(req));
  var error = new ErrorController({
    model: model
  });
  error.render();
  res.statusCode = status;
  res.send(error.html);
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
