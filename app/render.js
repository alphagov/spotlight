define([
  'stagecraft_api_client',
  'common/views/govuk'
],
function (StagecraftApiClient, GovUkView) {

  var environment = process.env.NODE_ENV || 'development';

  var renderContent = function (req, res, model) {

    model.set('development', environment === 'development');

    var content = new GovUkView({
      requirePath: requirePath,
      assetPath: assetPath,
      environment: environment,
      model: model
    });

    content.once('postrender', function () {
      res.send(content.html);
    });

    content.render();
  };

  var setup = function (req, res, next) {
    var model = new StagecraftApiClient();
    model.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub';

    model.on('sync', function () {
      model.off();
      renderContent(req, res, model);
    });

    model.on('error', function (model, xhr, options) {
      model.off();
      res.status(xhr.status);
      renderContent(req, res, model);
    });

    model.on('unknown', function (model) {
      res.status(501);
    });

    model.setPath(req.url);
  };

  return setup;
});
