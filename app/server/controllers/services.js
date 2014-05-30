var requirejs = require('requirejs');
var Backbone = require('backbone');

var dashboards = require(require('path').join('../../../', global.config.stagecraftStubPath, 'all'));

var View = require('../views/services');

var DashboardCollection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

module.exports = function (req, res) {
  var services = new DashboardCollection(dashboards.items).filterDashboards(DashboardCollection.SERVICES),
      model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    title: 'Services',
    'page-type': 'services',
    'filter': req.query.filter || '',
    'data': services
  }));

  var collection = new DashboardCollection(services);

  var view = new View({
    model: model,
    collection: collection
  });
  view.render();

  res.send(view.html);
};
