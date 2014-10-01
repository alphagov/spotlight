var requirejs = require('requirejs');
var Backbone = require('backbone');
var sanitizer = require('sanitizer');

var get_dashboard_and_render = require('../mixins/get_dashboard_and_render');

var ErrorView = require('../views/error');
var View = require('../views/web-traffic');

var DashboardCollection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

var renderContent = function (req, res, client_instance) {
  var contentDashboards = new DashboardCollection(client_instance.get('items')).filterDashboards(DashboardCollection.CONTENT),
      collection = new DashboardCollection(contentDashboards);

  var departments = collection.getDepartments();
  var agencies = collection.getAgencies();

  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    title: 'Web traffic',
    'page-type': 'services',
    filter: sanitizer.escape(req.query.filter || ''),
    departmentFilter: req.query.department || null,
    departments: departments,
    agencyFilter: req.query.agency || null,
    agencies: agencies,
    data: contentDashboards,
    script: true,
    noun: 'dashboard'
  }));

  var client_instance_status = client_instance.get('status'); 
  var view;
  if(client_instance_status === 200) {
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
