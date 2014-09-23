var Backbone = require('backbone');
var requirejs = require('requirejs');

var View = require('../views/homepage');
var ErrorView = require('../views/error');

var Collection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

var get_dashboard_and_render = require('../mixins/get_dashboard_and_render');

var renderContent = function(req, res, client_instance) {
  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    'data': client_instance.get('items')
  }));

  var collection = new Collection(client_instance.get('items'));

  var client_instance_status = client_instance.get('status'); 
  var view;
  if(client_instance_status === 200 || client_instance_status === 501) {
    view = new View({
      model: model,
      collection: collection
    });
  } else {
    view = new ErrorView({
      model: model,
      collection: collection
    });
  }
  view.render();

  res.set('Cache-Control', 'public, max-age=7200');
  res.send(view.html);
};

module.exports = function (req, res) {
  var client_instance = get_dashboard_and_render(req, res, renderContent);
  client_instance.setPath('');
};
