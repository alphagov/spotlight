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

  console.time('render');
  var start = process.hrtime();
  controller.render({ init: true });
  var diff = process.hrtime(start)
  console.log('render took %d nanoseconds', diff[0] * 1e9 + diff[1]);
  console.timeEnd('render');

  return controller;
};

var setup = function (req, res, next) {
  var client_instance = setup.get_dashboard_and_render(req, res, setup.renderContent);
  if (req.path.indexOf('&') > 0) {
    client_instance.set('status', 404);
    client_instance.set('controller', client_instance.controllers.error);
    client_instance.trigger('error');
  } else {
    client_instance.set('script', true);
    client_instance.setPath(req.path.replace('/performance', ''));
  }
  next();
};

setup.renderContent = renderContent;
setup.get_dashboard_and_render = get_dashboard_and_render;

module.exports = setup;
