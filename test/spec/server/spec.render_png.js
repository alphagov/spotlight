define([
  'render_png'
],
function (renderPng) {
  describe("renderPng", function () {
    describe("getScreenshotPath", function () {

      it("creates the URL for the screenshot service call", function () {
        renderPng.screenshotServiceUrl = 'http://screenshotservice';
        renderPng.screenshotTargetUrl = 'http://spotlight';
        var url = '/test/path.png';
        var screenshotPath = renderPng.getScreenshotPath(url);
        expect(screenshotPath).toEqual('http://screenshotservice?readyExpression=$("body").hasClass("ready")&forwardCacheHeaders=true&clipSelector=.visualisation&url=http://spotlight/test/path?raw');
      });
    });
  });
});
