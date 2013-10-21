define([
  'stagecraft_api_client',
  'common/views/govuk',
  'view_directory'
],
function (StagecraftApiClient, GovUkView, ViewDirectory) {

  var environment = process.env.NODE_ENV || 'development';

  var viewDirectory = new ViewDirectory();

  var renderContent = function (req, res, model) {

    model.set('development', environment === 'development');

    var content = new GovUkView({
      requirePath: requirePath,
      assetPath: assetPath,
      environment: environment,
      model: model,
      contentView: viewDirectory.viewFromStagecraftResponse(model)
    });

    content.once('postrender', function () {
      res.send(content.html);
    });

    content.render();
  };

  var render = function (req, res) {
    var model = new StagecraftApiClient();
    model.once('sync error', function () {
      model.off();
      renderContent(req, res, model);
    });

    model.setPath(req.url);
  };

  return render;
});
