define([
  'stagecraft_api_client'
],
function (StagecraftApiClient) {

  var renderContent = function (req, res, model) {
    model.set({
      requirePath: req.app.get('requirePath'),
      assetPath: req.app.get('assetPath'),
      environment: req.app.get('environment'),
      route: req.route
    });

    var ControllerClass = model.get('controller');
    var controller = new ControllerClass({
      model: model,
      raw: req.query.raw
    });

    controller.once('ready', function () {
      res.send(controller.html);
    });

    controller.render();

    return controller;
  };

  var setup = function (req, res, next) {
    var model = setup.getStagecraftApiClient();

    model.set('development', req.app.get('environment') === 'development');
    model.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub';

    model.on('sync error', function () {
      model.off();
      res.status(model.get('status'));
      setup.renderContent(req, res, model);
    });

    model.setPath(req.url);
  };

  setup.getStagecraftApiClient = function () {
    return new StagecraftApiClient();
  };
  setup.renderContent = renderContent;

  return setup;
});
