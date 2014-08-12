var path = require('path');
var fs = require('fs');

module.exports = {
  configure: function (env, options) {

    var configFileName = function (key) {
      return ['config.', key, '.json'].join('');
    };

    // If we're in development and the personal gitignored config file exists, use it
    if (env === 'development' && fs.existsSync(path.join('config', configFileName('development_personal')))) {
      env = 'development_personal';
    }

    var config = JSON.parse(fs.readFileSync(path.join('config', configFileName(env))));

    var filteredOptions = _.pick(options, _.keys(config));
    return _.extend(config, filteredOptions);
  }
};
