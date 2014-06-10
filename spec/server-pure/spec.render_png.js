var renderPng = require('../../app/render_png');
describe('renderPng', function () {
  describe('getScreenshotPath', function () {

    it('creates the URL for the screenshot service call', function () {
      renderPng.screenshotServiceUrl = 'http://screenshotservice';
      renderPng.screenshotTargetUrl = 'http://spotlight';
      var url = '/test/path.png';
      var screenshotPath = renderPng.getScreenshotPath(url);
      expect(screenshotPath).toEqual('http://screenshotservice?readyExpression=!!document.querySelector(".loaded")&forwardCacheHeaders=true&clipSelector=.visualisation-inner&url=http://spotlight/test/path?raw');
    });
  });
});
