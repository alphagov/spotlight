define([
  'stagecraft_api_client',
  'underscore',
  './preprocessors/navigation',
  './preprocessors/module_actions'
],
function (StagecraftApiClient, _) {
  
  var bootstrap = function (config) {
    _.each(bootstrap.preprocessors, function (preprocessor) {
      preprocessor();
    });

    var model = new StagecraftApiClient(config, { parse: true });
    var ControllerClass = model.get('controller');
    var controller = new ControllerClass({
      model: model
    });
    controller.on('ready', function () {
      $('body').addClass('ready');
    });
    controller.render({ init: true });
    return controller;
  };

  bootstrap.preprocessors = Array.prototype.slice.call(arguments, 2);

  return bootstrap;
});
