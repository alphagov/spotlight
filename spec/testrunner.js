require(['app/config.js'], function (requireConfig) {
  requireConfig.baseUrl = 'app/';
  require.config(requireConfig);

  require(window.specs, function () {
    var jasmineEnv = jasmine.getEnv();

    jasmineEnv.updateInterval = 1000;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
      return htmlReporter.specFilter(spec);
    };

    jasmineEnv.execute();
  });
});
