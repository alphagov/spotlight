var requirejs = require('requirejs');
var Backbone = require('backbone');
var _ = require('lodash');

var dashboards = require('../../stubs/stagecraft/dashboards');
var controller = require('../../../app/server/controllers/web-traffic');
var View = require('../../../app/server/views/web-traffic');
var ServicesView = require('../../../app/server/views/services');
var get_dashboard_and_render = require('../../../app/server/mixins/get_dashboard_and_render');

var PageConfig = requirejs('page_config');

describe('Web traffic Controller', function () {

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
    spyOn(View.prototype, 'initialize');
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

  it('creates a model containing config and page settings', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      config: 'setting',
      'page-type': 'services'
    }));
  });

  it('passes query params filter to model if defined', function () {
    controller(_.extend({ query: { filter: 'foo' } }, fake_app), res);
    client_instance.trigger('sync');
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
      filter: 'foo'}));
  });

  it('creates a collection', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(Backbone.Collection.prototype.initialize).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('creates a web traffic view', function () {
    controller(req, res);
    client_instance.trigger('sync');
    expect(View.prototype.initialize).toHaveBeenCalledWith({
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
