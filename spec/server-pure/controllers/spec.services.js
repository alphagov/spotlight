var requirejs = require('requirejs');
var Backbone = require('backbone');
var _ = require('lodash');

var dashboards = require('../../../app/support/stagecraft_stub/responses/dashboards');
var transactions = require('../../../app/support/stagecraft_stub/responses/transaction-data');
var controller = require('../../../app/server/controllers/services');
var ServicesView = require('../../../app/server/views/services');
var get_dashboard_and_render = require('../../../app/server/mixins/get_dashboard_and_render');

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
    query: {}
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
    spyOn(ServicesView.prototype, 'render').andCallFake(function () {
      this.html = 'html string';
    });
    client_instance = get_dashboard_and_render.buildStagecraftApiClient(req);
    spyOn(get_dashboard_and_render, 'buildStagecraftApiClient').andCallFake(function (req) {
      // take fresh copies of JSON responses for each test in case any test modifies them
      client_instance.set({'status': 200, 'items': JSON.parse(JSON.stringify(dashboards.items)), 'transactions': JSON.parse(JSON.stringify(transactions))});
      return client_instance;
    });
  });

  it('is a function', function () {
    expect(typeof controller).toEqual('function');
  });

  it('creates a model containing config and page settings', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith({
      config: 'setting',
      title: 'Services',
      'page-type': 'services',
      filter: '',
      departmentFilter: null,
      departments: jasmine.any(Array),
      agencyFilter: null,
      agencies: jasmine.any(Array),
      data: jasmine.any(Array),
      script: true,
      noun: 'service'
    });
  });

  it('passes query params filter to model if defined', function () {
    controller(_.extend({ query: { filter: 'foo' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith({
      config: 'setting',
      title: 'Services',
      'page-type': 'services',
      filter: 'foo',
      departmentFilter: null,
      departments: jasmine.any(Array),
      agencyFilter: null,
      agencies: jasmine.any(Array),
      data: jasmine.any(Array),
      script: true,
      noun: 'service'
    });
  });

  it('passes department filter to model if set', function () {
    controller(_.extend({ query: { department: 'home-office' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith({
      config: 'setting',
      title: 'Services',
      'page-type': 'services',
      filter: '',
      departmentFilter: 'home-office',
      departments: jasmine.any(Array),
      agencyFilter: null,
      agencies: jasmine.any(Array),
      data: jasmine.any(Array),
      script: true,
      noun: 'service'
    });
  });

  it('sanitizes user input before rendering it', function () {
    controller(_.extend({ query: { filter: '<script>alert(1)</script>' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith({
      config: 'setting',
      title: 'Services',
      'page-type': 'services',
      filter: '&lt;script&gt;alert(1)&lt;/script&gt;',
      departmentFilter: null,
      departments: jasmine.any(Array),
      agencyFilter: null,
      agencies: jasmine.any(Array),
      data: jasmine.any(Array),
      script: true,
      noun: 'service'
    });
  });

  it('creates a collection', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(Backbone.Collection.prototype.initialize).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('adds KPIs to each service model', function () {
    var services,
      service;
    controller(req, res);
    client_instance.trigger('sync');
    services = Backbone.Collection.prototype.initialize.mostRecentCall.args[0];
    service = _.findWhere(services, {
      slug: 'bis-accounts-filing'
    });

    expect(service['total-cost']).toEqual(345983458);
    expect(service['transactions-per-year']).toEqual(23534666);
    expect(service['cost-per-transaction']).toEqual(250);
    expect(service['tx-digital-takeup']).toEqual(0.41);
    expect(service['digital-takeup']).toEqual(0.43);
    expect(service['completion-rate']).toEqual(0.73);
    expect(service['user-satisfaction-score']).toEqual(0.63);
  });

  it('creates a services view', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(ServicesView.prototype.initialize).toHaveBeenCalledWith({
      model: jasmine.any(Backbone.Model),
      collection: jasmine.any(Backbone.Collection)
    });
  });

  it('renders the services view', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(ServicesView.prototype.render).toHaveBeenCalled();
  });

  it('sends the services view html', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(res.send).toHaveBeenCalledWith('html string');
  });

  it('has an explicit caching policy', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=7200');
  });

});
