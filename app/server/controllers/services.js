var requirejs = require('requirejs');
var Backbone = require('backbone');
var sanitizer = require('sanitizer');

var ServicesView = require('../views/services');
var HomepageView = require('../views/homepage');

var ErrorView = require('../views/error');

var ServicesCollection = requirejs('common/collections/services');
var Collection = requirejs('extensions/collections/collection');
var PageConfig = requirejs('page_config');

var get_dashboard_and_render = require('../mixins/get_dashboard_and_render');

var tools = require('./tools');

var dataSource = {
  'data-group': 'service-aggregates',
  'data-type': 'latest-dataset-values',
  'query-params': {
    'sort_by': '_timestamp:descending'
  }
};

var renderContent = function (req, res, client_instance) {

  var servicesCollection = new ServicesCollection(client_instance.get('items')),
    services = servicesCollection.filterDashboards(ServicesCollection.SERVICES),
    contentDashboards = servicesCollection.filterDashboards(ServicesCollection.CONTENT),
    otherDashboards = servicesCollection.filterDashboards(ServicesCollection.OTHER),
    collection;

  var transactions = new Collection([], {dataSource: dataSource});

  transactions.on('sync', function () {
    var showcaseServices = [],
      maxShowcaseServices = 4;
    services = formatCollectionData(services);
    services = addServiceDataToCollection(services, transactions.toJSON());
    collection = new ServicesCollection(services, servicesController.serviceAxes);

    _.each(_.shuffle(servicesController.showcaseServiceSlugs), function (slug) {
      var showcaseService = _.findWhere(services, function (service) {
        if (slug === service.slug) {
          service.deptCode = (service.department && service.department.abbr &&
          service.department.abbr.toLowerCase().replace(' ', '-')) || '';
          return true;
        } else {
          return false;
        }
      });
      if (showcaseService) {
        showcaseServices.push(showcaseService);
        if (showcaseServices.length === maxShowcaseServices) {
          return false;
        }
      } else {
        global.logger.error('Could not find showcase service: ' + slug);
      }
    });

    var departmentFilter = req.query.department || null;
    var departmentFilterTitle = collection.getDepartmentFilterTitle(departmentFilter);
    var serviceGroupFilter = req.query.servicegroup || null;
    var serviceGroupFilterTitle = collection.getServiceGroupFilterTitle(serviceGroupFilter);

    var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
      title: 'Services data',
      'page-type': 'services',
      filter: sanitizer.escape(req.query.filter || ''),
      departmentFilter: departmentFilter,
      departmentFilterTitle: departmentFilterTitle,
      serviceGroupFilter: serviceGroupFilter,
      serviceGroupFilterTitle: serviceGroupFilterTitle,
      departments: collection.departmentList,
      agencies: collection.agencyList,
      serviceGroups: collection.serviceGroupList,
      data: services,
      script: (servicesController.type === 'services') ? true : false,
      noun: 'service',
      axesOptions: servicesController.serviceAxes,
      params: _.extend({
        sortby:  'number_of_transactions',
        sortorder:  'descending'
      }, client_instance.get('params'))
    }));

    var client_instance_status = client_instance.get('status');
    var view;
    var View = (servicesController.type === 'services') ? ServicesView : HomepageView;
    if (client_instance_status === 200) {
      view = new View({
        model: model,
        collection: collection,
        contentDashboards: contentDashboards,
        otherDashboards: otherDashboards,
        showcaseServices: showcaseServices
      });
      // only mark good responses as being cacheable
      res.set('Cache-Control', 'public, max-age=7200');
    } else {
      view = new ErrorView({
        model: model,
        collection: collection
      });
      res.set('Cache-Control', 'public, max-age=5');
    }
    view.render();
    res.send(view.html);
  });

  transactions.fetch();

};

function formatCollectionData(services) {
  var kpis = {
    'total_cost': null,
    'number_of_transactions': null,
    'cost_per_transaction': null,
    'tx_digital_takeup': null,
    'digital_takeup': null,
    'completion_rate': null,
    'user_satisfaction_score': null
  };
  _.each(services, function (service) {
    _.extend(service, kpis);
    service.titleLink = '<a href="/performance/' + service.slug + '">' + service.title + '</a>';
    service.department_name = tools.get_department_name(service);
  });

  return services;
}

function addServiceDataToCollection (services, serviceData) {
  var dashboard;

  _.each(serviceData, function (item) {
    var slug = item.dashboard_slug;

    // only bother looking for the dashboard if we don't already have it
    if (!dashboard || (dashboard.slug !== slug)) {
      dashboard = _.findWhere(services, {
        slug: slug
      });
    }
    if (dashboard) {
      delete item._id;
      delete item._timestamp;
      delete item.dashboard_slug;
      _.extend(dashboard, item);
    }

  });
  return services;
}

function servicesController (type, req, res) {
  var client_instance;
  servicesController.type = type;
  client_instance = get_dashboard_and_render(req, res, renderContent);
  client_instance.fetch();
  return client_instance;
}

servicesController.showcaseServiceSlugs = [
  'prison-visits',
  'book-practical-driving-test',
  'carers-allowance',
  'renew-patent',
  'accelerated-possession-eviction',
  'registered-traveller',
  'change-practical-driving-test',
  'lasting-power-of-attorney',
  'pay-register-death-abroad',
  'pay-register-birth-abroad'
];

servicesController.serviceAxes = {
  axes: {
    x: {
      key: 'titleLink',
      label: 'Service name'
    },
    y: [
      {
        key: 'number_of_transactions',
        label: 'Completed transactions per year',
        format: 'integer'
      }
    ]
  }
};

module.exports = servicesController;

