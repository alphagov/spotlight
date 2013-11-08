define([
  'stagecraft_api_client'
],
function (StagecraftApiClient, config) {
  return function (config) {
    var model = new StagecraftApiClient(config, { parse: true });
    var ControllerClass = model.get('controller');
    var controller = new ControllerClass({
      model: model
    });
    controller.render({ init: true });
    return controller;
  };
});
