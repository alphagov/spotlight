var requirejs = require('requirejs');
var Backbone = require('backbone');
var _ = require('lodash');

var dashboards = require('../../../tests/stagecraft_stub/dashboards');
var controller = require('../../../app/server/controllers/simple-dashboard-list');
var View = require('../../../app/server/views/simple-dashboard-list');
var ServicesView = require('../../../app/server/views/services');
var StagecraftApiClient = requirejs('stagecraft_api_client');

var PageConfig = requirejs('page_config');

describe('Simple dashboard list controller', function () {

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
  var client_instance;

  beforeEach(function () {
    spyOn(PageConfig, 'commonConfig').andReturn({
      config: 'setting'
    });
    spyOn(Backbone.Model.prototype, 'initialize');
    spyOn(Backbone.Collection.prototype, 'initialize');
    spyOn(View.prototype, 'initialize');
    spyOn(ServicesView.prototype, 'render').andCallFake(function () {
      this.html = 'html string';
    });

    spyOn(StagecraftApiClient.prototype, 'fetch').andCallFake(function () {});
  });

  afterEach(function() {
    this.removeAllSpies();
  });

  it('creates a model containing config and page settings', function () {
    client_instance = controller('web-traffic', req, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      config: 'setting',
      'page-type': 'services'
    }));
  });

  it('passes query params filter to model if defined', function () {
    var queryReq = _.cloneDeep(req);
    queryReq.query.filter = 'foo';
    client_instance = controller('web-traffic', queryReq, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      filter: 'foo'}));
  });

  it('creates a collection', function () {
    client_instance = controller('web-traffic', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(Backbone.Collection.prototype.initialize).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('creates a view', function () {
    client_instance = controller('web-traffic', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(View.prototype.initialize).toHaveBeenCalledWith({
      model: jasmine.any(Backbone.Model),
      collection: jasmine.any(Backbone.Collection)
    });
  });

  it('renders the services view', function () {
    client_instance = controller('web-traffic', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(ServicesView.prototype.render).toHaveBeenCalled();
  });

  it('sends the services view html', function () {
    client_instance = controller('web-traffic', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(res.send).toHaveBeenCalledWith('html string');
  });

  it('has an explicit caching policy', function () {
    client_instance = controller('web-traffic', req, res);
    client_instance.set({
      'status': 200,
      'items': _.cloneDeep(dashboards.items)
    });
    client_instance.trigger('sync');
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=7200');
  });

});
