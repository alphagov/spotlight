var requirejs = require('requirejs');
var Backbone = require('backbone');
var sanitizer = require('sanitizer');

var dashboards = require('../../support/stagecraft_stub/responses/dashboards'),
    departments = require('../../support/stagecraft_stub/responses/departments');

var View = require('../views/services');

var DashboardCollection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

module.exports = function (req, res) {
  var services = new DashboardCollection(dashboards.items).filterDashboards(DashboardCollection.SERVICES),
      collection = new DashboardCollection(services),
      model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    title: 'Services',
    'page-type': 'services',
    filter: sanitizer.escape(req.query.filter || ''),
    departmentFilter: req.query.department || null,
    departments: departments,
    data: services,
    script: true
  }));

  var view = new View({
    model: model,
    collection: collection
  });
  view.render();

  res.set('Cache-Control', 'public, max-age=120');
  res.send(view.html);
};
