define([
  'stagecraft_api_client'
],
function (StagecraftApiClient) {
  var renderContent = function (req, res, model) {
    model.set({
      requestPath: req.path,
      requestUrl: setup.getFullUrl(req),
      govukUrl: setup.getGovukUrl(req),
      requirePath: req.app.get('requirePath'),
      assetPath: req.app.get('assetPath'),
      environment: req.app.get('environment'),
      backdropUrl: req.app.get('backdropUrl'),
      clientRequiresCors: req.app.get('clientRequiresCors')
    });

    var ControllerClass = model.get('controller');
    var controller = new ControllerClass({
      model: model,
      raw: req.query.raw,
      url: req.originalUrl
    });

    controller.once('ready', function () {
      res.send(controller.html);
    });

    controller.render({ init: true });

    return controller;
  };

  var getFullUrl = function (req) {
    return [req.protocol, "://", req.get('host'), req.url].join('');
  };

  var getGovukUrl = function (req) {
    return [req.protocol, "://", req.app.get('govukHost'), req.originalUrl].join('');
  };

  var setup = function (req, res, next) {
    var model = setup.getStagecraftApiClient();

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
  setup.getFullUrl = getFullUrl;
  setup.getGovukUrl = getGovukUrl;

  return setup;
});
