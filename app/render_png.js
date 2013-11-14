define([
  'http',
  'url'
],
function (http, url) {
  var screenshotServiceUrl = config.screenshotServiceUrl;
  var screenshotTargetUrl = config.screenshotTargetUrl;
  var port = config.port;
  var getScreenshotPath = function (url) {
    return [
      screenshotServiceUrl,
      '?readyExpression=$("body").hasClass("ready")',
      '&forwardCacheHeaders=true',
      '&clipSelector=.visualisation',
      '&url=',
      screenshotTargetUrl,
      url.replace(".png", "")
    ].join('');
  };

  return function (req, res) {
    var options = url.parse(getScreenshotPath(req.url));
    http.get(options, function (screenshot) {
      res.status(screenshot.statusCode);
      for (var i in screenshot.headers) {
        res.setHeader(i, screenshot.headers[i]);
      }
      screenshot.on("data", function(chunk) {
        res.write(chunk);
      });
      screenshot.on("end", function () {
        res.end();
      });
    }).on('error', function (e) {
      res.status(500);
      res.send("Got error: " + e.message);
    });
  };
});
