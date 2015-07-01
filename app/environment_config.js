var path = require('path');
var fs = require('fs');
var Mustache = require('Mustache');

module.exports = {
  configure: function (env, options) {

    var configFileName = function (key) {
      return ['config.', key, '.json'].join('');
    };

    // If we're in development and the personal gitignored config file exists, use it
    if (env === 'development' && fs.existsSync(path.join('config', configFileName('development_personal')))) {
      env = 'development_personal';
    }

    var fileContents = fs.readFileSync(path.join('config', configFileName(env)), 'utf8');

    var renderedMustache = Mustache.render(fileContents, {govukAppDomain: process.env.GOVUK_APP_DOMAIN})

    var config = JSON.parse(renderedMustache);

    var filteredOptions = _.pick(options, _.keys(config));
    return _.extend(config, filteredOptions);
  }
};
