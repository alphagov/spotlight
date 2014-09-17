var requirejs = require('requirejs');

var PageConfig = requirejs('page_config');
var controllerMap = require('./server/controller_map')();

var StagecraftApiClient = requirejs('stagecraft_api_client');

var get_dashboard_and_render = require('./server/mixins/get_dashboard_and_render');

var renderContent = function (req, res, model) {
  model.set(PageConfig.commonConfig(req));

  var ControllerClass = model.get('controller');
  var controller = new ControllerClass({
    model: model,
    url: req.originalUrl
  });

  controller.once('ready', function () {
    res.set('Cache-Control', 'public, max-age=120');
    if (model.get('published') !== true) {
      res.set('X-Robots-Tag', 'none');
    }
    req['spotlight-dashboard-slug'] = model.get('slug');
    res.send(controller.html);
  });

  controller.render({ init: true });

  return controller;
};

var setup = function (req, res) {
  var client_instance = get_dashboard_and_render(req, res, setup.renderContent);
  //I have no idea what this does, can't find anything obvious in the docs or this app.
  client_instance.set('script', true);
  client_instance.setPath(req.url.replace('/performance', ''));
};

setup.renderContent = renderContent;

module.exports = setup;
