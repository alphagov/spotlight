define([
  'stagecraft_api_client'
],
function (StagecraftApiClient) {

  var getControllerOptions = function(req, res, controllerData) {
    return {
      requirePath: req.app.get('requirePath'),
      assetPath: req.app.get('assetPath'),
      environment: req.app.get('environment'),
      model: controllerData,
      route: req.route
    };
  };

  var renderContent = function (req, res, controllerData) {
    var options = getControllerOptions.apply(null, arguments);
    var controller = new controllerData.getController(options);

    controller.once('ready', function () {
      res.send(controller.html);
    });

    controller.render();

    return controller;
  };

  var setup = function (req, res, next) {
    var controllerData = setup.getStagecraftApiClient();

    controllerData.set('development', req.app.get('environment') === 'development');
    controllerData.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub';

    controllerData.on('sync', function () {
      controllerData.off();
      setup.renderContent(req, res, controllerData);
    });

    controllerData.on('error', function (model, xhr, options) {
      controllerData.off();
      res.status(xhr.status);
      setup.renderContent(req, res, controllerData);
    });

    controllerData.on('unknown', function (model) {
      res.status(501);
    });

    controllerData.setPath(req.url);
  };

  setup.getStagecraftApiClient = function () {
    return new StagecraftApiClient();
  };
  setup.renderContent = renderContent;

  return setup;
});
