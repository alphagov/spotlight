define([
  'stagecraft_api_client',
  'lodash',
  'modernizr',
  './preprocessors/visualisation_fallback',
  './preprocessors/report_a_problem'
],
function (StagecraftApiClient, _, Modernizr) {

  var bootstrap = function (config) {
    _.each(bootstrap.preprocessors, function (preprocessor) {
      preprocessor();
    });

    if (config.clientRequiresCors && !(Modernizr.cors || window.XDomainRequest)) {
      // Don't bootstrap client in non-CORS browsers when CORS is required
      return;
    }

    var model = new StagecraftApiClient(config, { parse: true });
    var ControllerClass = model.get('controller');
    var controller = new ControllerClass({
      model: model,
      url: model.get('url')
    });
    controller.on('ready', function () {
      $('body').addClass('ready');
    });
    controller.on('loaded', function () {
      $('body').addClass('loaded');
    });
    controller.render({ init: true });
    return controller;
  };

  bootstrap.preprocessors = Array.prototype.slice.call(arguments, 3);

  return bootstrap;
});
