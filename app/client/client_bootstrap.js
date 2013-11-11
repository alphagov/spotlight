define([
  'stagecraft_api_client',
  'underscore',
  './preprocessors/navigation'
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
    controller.render({ init: true });
    return controller;
  };

  bootstrap.preprocessors = Array.prototype.slice.call(arguments, 2);

  return bootstrap;
});
