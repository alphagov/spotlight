define([
  'http',
  'url'
],
function (http, url) {
  var screenshotUrl = config.screenshotUrl;
  var port = config.port;
  var getScreenshotPath = function (url) {
    url = url.replace(".png", "");
    return screenshotUrl + '?url=http://localhost:' + port + url;
  };

  return function (req, res) {
    var options = url.parse(getScreenshotPath(req.url));
    http.get(options, function (screenshot) {
      res.writeHead(screenshot.statusCode, screenshot.headers);
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
