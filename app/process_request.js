var requirejs = require('requirejs');

var PageConfig = requirejs('page_config');

var get_dashboard_and_render = require('./server/mixins/get_dashboard_and_render');

var renderContent = function (req, res, model) {
  model.set(PageConfig.commonConfig(req));

  var ControllerClass = model.get('controller');
  var controller = new ControllerClass({
    model: model,
    url: req.originalUrl
  });

  controller.once('ready', function () {
    res.set('Cache-Control', controller.cacheOptions());
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
  var client_instance = setup.get_dashboard_and_render(req, res, setup.renderContent);
  client_instance.set('script', true);
  client_instance.setPath(req.url.replace('/performance', ''));
};

setup.renderContent = renderContent;
setup.get_dashboard_and_render = get_dashboard_and_render;

module.exports = setup;
