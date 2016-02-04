var requirejs = require('requirejs');
var Backbone = require('backbone');
var sanitizer = require('sanitizer');

var get_dashboard_and_render = require('../mixins/get_dashboard_and_render');

var View = require('../views/simple-dashboard-list');
var ErrorView = require('../views/error');

var DashboardCollection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

var tools = require('./tools');

function controllerSettings(type) {
  switch (type) {
    case 'web-traffic':
      return {
        title: 'Web traffic dashboards',
        example: 'Cabinet office',
        dashboardTypes: DashboardCollection.CONTENT
      };
    case 'other':
      return {
        title: 'Other performance dashboards',
        example: 'G-cloud',
        dashboardTypes: DashboardCollection.OTHER
      };
  }
}

var renderContent = function (req, res, client_instance) {
  var contentDashboards,
    collection,
    settings = controllerSettings(controller.type);

  contentDashboards = new DashboardCollection(client_instance.get('items'))
    .filterDashboards(settings.dashboardTypes);

  _.each(contentDashboards, function (service) {
    service.titleLink = '<a href="/performance/' + service.slug + '">' + service.title + '</a>';
    service.department_name = tools.get_department_name(service);
  });

  collection = new DashboardCollection(contentDashboards, controller.axesOptions);

  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    title: settings.title,
    example: settings.example,
    'page-type': 'services',
    filter: sanitizer.escape(req.query.filter || ''),
    data: contentDashboards,
    script: true,
    noun: 'dashboard',
    axesOptions: controller.axesOptions,
    params: {
      sortby: 'titleLink',
      sortorder: 'ascending'
    }
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

function controller (type, req, res) {
  var client_instance;
  controller.type = type;
  client_instance = get_dashboard_and_render(req, res, renderContent);
  client_instance.fetch();

  return client_instance;
}

controller.axesOptions = {
  axes: {
    x: [
      {
        key: 'titleLink',
        label: 'Dashboard name'
      },
      {
        key: 'department_name',
        label: 'Department',
        format: 'sentence'
      }
    ],
    y: []
  }
};

module.exports = controller;
