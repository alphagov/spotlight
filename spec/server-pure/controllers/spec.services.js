var requirejs = require('requirejs');
var Backbone = require('backbone');
var _ = require('lodash');

var dashboards = require('../../../tests/stagecraft_stub/dashboards');
var transactions = require('../../../tests/backdrop_stub/transaction-data');
var controller = require('../../../app/server/controllers/services');
var StagecraftApiClient = requirejs('stagecraft_api_client');
var ServicesView = require('../../../app/server/views/services');
var Collection = requirejs('./extensions/collections/collection');

var PageConfig = requirejs('page_config');

describe('Services Controller', function () {
  var client_instance;
  var fake_app = {'app': {'get': function(key){
      return {
        'port':'8989',
        'stagecraftUrl':'the url',
        'assetPath': '/spotlight/'
      }[key];
    }}
  };
  var req = _.extend({
    get: function(key) {
      return {
        'Request-Id':'Xb35Gt',
        'GOVUK-Request-Id': '1231234123'
      }[key];
    },
    originalUrl: '',
    query: {
      filter: ''
    }
  }, fake_app);
  var res = {
    send: jasmine.createSpy(),
    set: jasmine.createSpy(),
    status: jasmine.createSpy()
  };

  beforeEach(function () {
    spyOn(PageConfig, 'commonConfig').andReturn({
      config: 'setting'
    });
    spyOn(Backbone.Model.prototype, 'initialize');
    spyOn(Backbone.Collection.prototype, 'initialize');
    spyOn(ServicesView.prototype, 'initialize');
    spyOn(Collection.prototype, 'fetch').andCallFake(function () {
      this.reset(_.cloneDeep(transactions.data), {silent: true});
      this.trigger('sync');
    });
    spyOn(ServicesView.prototype, 'render').andCallFake(function () {
      this.html = 'html string';
    });

    spyOn(StagecraftApiClient.prototype, 'fetch').andCallFake(function () {});
  });

  afterEach(function() {
    this.removeAllSpies();
  });

  it('creates a model containing config and page settings', function () {
    client_instance = controller('services', req, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      config: 'setting',
      'page-type': 'services'
    }));
  });

  it('passes a keyword filter to the model if defined in the querystring', function () {
    var queryReq = _.cloneDeep(req);
    queryReq.query.filter = 'foo';
    client_instance = controller('services', queryReq, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      filter: 'foo'}));
  });

  it('passes a department filter to the model if set in the querystring', function () {
    var queryReq = _.cloneDeep(req);
    queryReq.query.department = 'home-office';
    client_instance = controller('services', queryReq, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      departmentFilter: 'home-office'
    }));
  });

  it('passes a services filter to the model if set in the querystring', function () {
    controller('services', _.extend({ query: { service: 'carers-allowance' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      serviceFilter: 'carers-allowance'
    }));
  });

  it('sanitizes user input before rendering it', function () {
    var queryReq = _.cloneDeep(req);
    queryReq.query.filter = '<script>alert(1)</script>';
    client_instance = controller('services', queryReq, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      filter: '&lt;script&gt;alert(1)&lt;/script&gt;'
    }));
  });

  it('creates a collection', function () {
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(Backbone.Collection.prototype.initialize).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('adds KPIs to each service model', function () {
    var services,
      service;
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    services = Backbone.Collection.prototype.initialize.mostRecentCall.args[0];
    service = _.findWhere(services, {
      slug: 'accelerated-possession-eviction'
    });

    expect(service['total_cost']).toEqual(345983458);
    expect(service['number_of_transactions']).toEqual(23534666);
    expect(service['cost_per_transaction']).toEqual(250);
    expect(service['digital_takeup']).toEqual(0.43);
    expect(service['completion_rate']).toEqual(0.73);
    expect(service['user_satisfaction_score']).toEqual(0.63);
  });

  it('creates a services view', function () {
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(ServicesView.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      model: jasmine.any(Backbone.Model),
      collection: jasmine.any(Backbone.Collection)
    }));
  });

  it('creates a list of showcase services', function () {
    var showcaseServices,
      slugs;

    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    showcaseServices = ServicesView.prototype.initialize.calls[0].args[0].showcaseServices;
    slugs = _.pluck(showcaseServices, 'slug');
    expect(slugs).toEqual(_.intersection(slugs, controller.showcaseServiceSlugs));
  });

  it('only lists showcase services that have data', function () {
    var showcaseServices,
      dashboardList,
      slugs;

    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    dashboardList = _.reject(client_instance.get('items'),
      {slug: controller.showcaseServiceSlugs[0]});

    client_instance.set('items', dashboardList);
    client_instance.trigger('sync');
    slugs = _.pluck(showcaseServices, 'slug');
    showcaseServices = ServicesView.prototype.initialize.calls[0].args[0].showcaseServices;
    expect(slugs).toEqual(_.intersection(slugs, controller.showcaseServiceSlugs.slice(1)));
  });

  it('renders the services view', function () {
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(ServicesView.prototype.render).toHaveBeenCalled();
  });

  it('sends the services view html', function () {
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(res.send).toHaveBeenCalledWith('html string');
  });

  it('has an explicit caching policy', function () {
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=7200');
  });

  it('has a shorter explicit caching policy for errors', function () {
    client_instance = controller('services', req, res);
    client_instance.set({
      'status': 500
    });
    client_instance.trigger('sync');
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=5');
  });

});
