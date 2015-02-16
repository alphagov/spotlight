var requirejs = require('requirejs');
var Backbone = require('backbone');
var _ = require('lodash');

var dashboards = require('../../../app/support/stagecraft_stub/responses/dashboards');
var transactions = require('../../../app/support/backdrop_stub/responses/transaction-data');
var controller = require('../../../app/server/controllers/services');
var ServicesView = require('../../../app/server/views/services');
var get_dashboard_and_render = require('../../../app/server/mixins/get_dashboard_and_render');
var Collection = requirejs('./extensions/collections/collection');

var PageConfig = requirejs('page_config');

describe('Services Controller', function () {

  var fake_app = {'app': {'get': function(key){
      return {
        'port':'8989',
        'stagecraftUrl':'the url'
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
  var client_instance;

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
    client_instance = get_dashboard_and_render.buildStagecraftApiClient(req);
    spyOn(get_dashboard_and_render, 'buildStagecraftApiClient').andCallFake(function () {
      client_instance.set({
        'status': 200,
        'items': _.cloneDeep(dashboards.items)
      });
      client_instance.set('params', {
        sortby: 'completion_rate',
        sortorder: 'ascending'
      });
      return client_instance;
    });
  });

  afterEach(function() {
    this.removeAllSpies();
  });

  it('is a function', function () {
    expect(typeof controller).toEqual('function');
  });

  it('creates a model containing config and page settings', function () {
    controller('services', req, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      config: 'setting',
      'page-type': 'services'
    }));
  });

  it('passes query params filter to model if defined', function () {
    controller('services', _.extend({ query: { filter: 'foo' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      filter: 'foo'}));
  });

  it('passes department filter to model if set', function () {
    controller('services', _.extend({ query: { department: 'home-office' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      departmentFilter: 'home-office'
    }));
  });

  it('sanitizes user input before rendering it', function () {
    controller('services', _.extend({ query: { filter: '<script>alert(1)</script>' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      filter: '&lt;script&gt;alert(1)&lt;/script&gt;'
    }));
  });

  it('creates a collection', function () {
    controller('services', req, res);
    client_instance.trigger('sync');
    expect(Backbone.Collection.prototype.initialize).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('adds KPIs to each service model', function () {
    var services,
      service;
    controller('services', req, res);
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
    controller('services', req, res);
    client_instance.trigger('sync');
    expect(ServicesView.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      model: jasmine.any(Backbone.Model),
      collection: jasmine.any(Backbone.Collection)
    }));
  });

  it('renders the services view', function () {
    controller('services', req, res);
    client_instance.trigger('sync');
    expect(ServicesView.prototype.render).toHaveBeenCalled();
  });

  it('sends the services view html', function () {
    controller('services', req, res);
    client_instance.trigger('sync');
    expect(res.send).toHaveBeenCalledWith('html string');
  });

  it('has an explicit caching policy', function () {
    controller('services', req, res);
    client_instance.trigger('sync');
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=7200');
  });

});
