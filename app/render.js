define([
  'stagecraft_api_client',
  'common/views/govuk'
],
function (StagecraftApiClient, GovUkView) {

  var renderContent = function (req, res, model) {
    var content = new GovUkView({
      requirePath: req.app.get('requirePath'),
      assetPath: req.app.get('assetPath'),
      environment: req.app.get('environment'),
      model: model
    });

    content.render();
    
    res.send(content.html);

    return content;
  };

  var setup = function (req, res, next) {
    var model = setup.getStagecraftApiClient();

    model.set('development', req.app.get('environment') === 'development');
    model.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub';

    model.on('sync', function () {
      model.off();
      setup.renderContent(req, res, model);
    });

    model.on('error', function (model, xhr, options) {
      model.off();
      res.status(xhr.status);
      setup.renderContent(req, res, model);
    });

    model.on('unknown', function (model) {
      res.status(501);
    });

    model.setPath(req.url);
  };

  setup.getStagecraftApiClient = function () {
    return new StagecraftApiClient(); 
  };
  setup.renderContent = renderContent;

  return setup;
});
