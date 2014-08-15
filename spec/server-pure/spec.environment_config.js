var fs = require('fs');
var path = require('path');

var environmentConfig = require('../../app/environment_config');

describe('environmentConfig', function () {
  var args = {
    _: [],
    backdropUrl: 'http://localhost:3057/backdrop-stub/{{ data-group }}/{{ data-type }}',
    '$0': 'node ./app/server.js',
    screenshotTargetUrl: 'http://localhost:3057'
  };
  var environmentJson = JSON.parse(fs.readFileSync(path.join('config', 'config.development.json')));
  var environment = 'development';
  var resultingConfigObject;

  beforeEach(function () {
    resultingConfigObject = environmentJson;
    resultingConfigObject.backdropUrl = args.backdropUrl;
    resultingConfigObject.screenshotTargetUrl = args.screenshotTargetUrl;
    spyOn(fs, 'existsSync').andReturn(false);
  });

  describe('configure', function () {
    it('should return the environmentJson for the environment with key values pairs for which there are args overwritten', function () {
      expect(environmentConfig.configure(environment, args)).toEqual(resultingConfigObject);
    });
  });
});
