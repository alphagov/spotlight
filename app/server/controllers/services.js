var requirejs = require('requirejs');
var Backbone = require('backbone');
var sanitizer = require('sanitizer');

var controllerMap = require('../../server/controller_map')();
var StagecraftApiClient = requirejs('stagecraft_api_client');

var View = require('../views/services');

var DashboardCollection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

var renderContent = function (req, res, client_instance) {
  var services = new DashboardCollection(client_instance.get('items')).filterDashboards(DashboardCollection.SERVICES),
      collection = new DashboardCollection(services);

  var departments = collection.getDepartments();
  var agencies = collection.getAgencies();

  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    title: 'Services',
    'page-type': 'services',
    filter: sanitizer.escape(req.query.filter || ''),
    departmentFilter: req.query.department || null,
    departments: departments,
    agencyFilter: req.query.agency || null,
    agencies: agencies,
    data: services,
    script: true,
    noun: 'service'
  }));

  var view = new View({
    model: model,
    collection: collection
  });
  view.render();

  res.set('Cache-Control', 'public, max-age=120');
  res.send(view.html);
};

module.exports = function (req, res) {
  var client_instance = new StagecraftApiClient({}, {
    ControllerMap: controllerMap 
  });
  client_instance.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub/';
  client_instance.stagecraftUrlRoot = req.app.get('stagecraftUrl') + '/public/dashboards';
  client_instance.on('sync', function () {
    client_instance.off();
    res.status(client_instance.get('status'));
    renderContent(req, res, client_instance);
  });

  client_instance.setPath('');
};
