define(['path', 'fs'], function (path, fs) {
  environmentConfig = {
    configure: function (environment, options) {
      var config = JSON.parse(fs.readFileSync(path.join('config', 'config.' + environment + '.json')));
      filtered_options = _.pick(options, _.keys(config));
      return _.extend(config, filtered_options);
    }
  };

  return environmentConfig;
});
