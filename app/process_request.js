var requirejs = require('requirejs');

var PageConfig = requirejs('page_config');
var controllerMap = require('./server/controller_map')();

var StagecraftApiClient = requirejs('stagecraft_api_client');


var renderContent = function (req, res, model) {
  model.set(PageConfig.commonConfig(req));

  var ControllerClass = model.get('controller');
  var controller = new ControllerClass({
    model: model,
    raw: _.has(req.query, 'raw'),
    url: req.originalUrl
  });

  controller.once('ready', function () {
    res.set('Cache-Control', 'public, max-age=120');
    res.send(controller.html);
  });

  controller.render({ init: true });

  return controller;
};

var setup = function (req, res) {
  var model = setup.getStagecraftApiClient();
  model.set('script', true);

  model.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub';

  model.on('sync error', function () {
    model.off();
    res.status(model.get('status'));
    setup.renderContent(req, res, model);
  });

  model.setPath(req.url.replace('/performance', ''));
};

setup.getStagecraftApiClient = function () {
  return new StagecraftApiClient({}, {
    ControllerMap: controllerMap
  });
};

setup.renderContent = renderContent;

module.exports = setup;
