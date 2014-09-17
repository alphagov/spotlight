var requirejs = require('requirejs');
var Backbone = require('backbone');

var dashboards = require('../../../app/support/stagecraft_stub/responses/dashboards');
var controller = require('../../../app/server/controllers/services');
var ServicesView = require('../../../app/server/views/services');
var StagecraftApiClient = requirejs('stagecraft_api_client');


var PageConfig = requirejs('page_config');

describe('Services Controller', function () {

  var fake_app = {'app': {'get': function(){
      return '8989'
    }}
  }
  var req = _.extend({
    query: {}
  }, fake_app);
  var res = {
    send: jasmine.createSpy(),
    set: jasmine.createSpy(),
    status: jasmine.createSpy(),
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
    spyOn(StagecraftApiClient.prototype, 'initialize').andCallFake(function () {
      this.set({'status': 200, 'items': dashboards.items});
      client_instance = this;
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
