var requirejs = require('requirejs');
var Backbone = require('backbone');

var controller = require('../../../app/server/controllers/services');
var ServicesView = require('../../../app/server/views/services');


var PageConfig = requirejs('page_config');

describe('Services Controller', function () {

  var req = {
    query: {}
  };
  var res = {
    send: jasmine.createSpy(),
    set: jasmine.createSpy(),
  };

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
  });

  it('is a function', function () {
    expect(typeof controller).toEqual('function');
  });

  it('creates a model containing config and page settings', function () {
    controller(req, res);
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith({
      config: 'setting',
      title: 'Services',
      'page-type': 'services',
      filter: '',
      data: jasmine.any(Array),
      script: true
    });
  });

  it('passes query params filter to model if defined', function () {
    controller({ query: { filter: 'foo' } }, res);
    expect(Backbone.Model.prototype.initialize).toHaveBeenCalledWith({
      config: 'setting',
      title: 'Services',
      'page-type': 'services',
      filter: 'foo',
      data: jasmine.any(Array),
      script: true
    });
  });

  it('creates a collection', function () {
    controller(req, res);
    expect(Backbone.Collection.prototype.initialize).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('creates a services view', function () {
    controller(req, res);
    expect(ServicesView.prototype.initialize).toHaveBeenCalledWith({
      model: jasmine.any(Backbone.Model),
      collection: jasmine.any(Backbone.Collection)
    });
  });

  it('renders the services view', function () {
    controller(req, res);
    expect(ServicesView.prototype.render).toHaveBeenCalled();
  });

  it('sends the services view html', function () {
    controller(req, res);
    expect(res.send).toHaveBeenCalledWith('html string');
  });

  it('has an explicit caching policy', function () {
    controller(req, res);
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=120');
  });

});