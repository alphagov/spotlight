var requirejs = require('requirejs');

var processRequest = require('../../app/process_request');

var Model = requirejs('extensions/models/model');
var Controller = requirejs('extensions/controllers/controller');
var ErrorController = require('../../app/server/controllers/error');
var View = requirejs('extensions/views/view');

describe('processRequest middleware', function () {

  var req, res, environment;
  beforeEach(function () {
    environment = 'development';
    var get = jasmine.createSpy();
    get.plan = function (id) {
      return {
        port: 1234,
        environment: environment,
        requirePath: '/testRequirePath',
        assetPath: '/testAssetPath',
        backdropUrl: '//testBackdrop/',
        externalBackdropUrl: '//testBackdrop/'
      }[id];
    };
    var headers = jasmine.createSpy();
    req = {
      app: {
        get: get
      },
      get: headers,
      originalUrl: 'test url',
      route: {},
      path: '/performance/carers-allowance',
      url: '/performance/carers-allowance'
    };
    res = {
      status: jasmine.createSpy(),
      send: jasmine.createSpy(),
      set: jasmine.createSpy()
    };
  });

  describe('stagecraft client setup', function () {
    var client;
    beforeEach(function () {
      client = new Model();
      client.setPath = jasmine.createSpy();
      spyOn(processRequest, 'get_dashboard_and_render').andReturn(client);
      spyOn(processRequest, 'renderContent');
    });

    it('removes the /performance part of the slug when setting the path', function () {
      processRequest(req, res);
      expect(client.setPath).toHaveBeenCalledWith('/carers-allowance');
    });

    it('it will 404 on requests with & that are not query params', function () {
      req.path = '/performance/carers-allowance&';
      //we need to create a fake controller map here as process_request links to the error controller on 404
      client.controllers = {
        error: true
      };
      processRequest(req, res);
      expect(client.get('status')).toEqual(404);
    });

  });

  describe('renderContent', function () {

    var model;
    beforeEach(function () {
      var ConcreteController = Controller.extend({
        viewClass: View,
        render: jasmine.createSpy()
      });
      model = new Model({
        controller: ConcreteController
      });
    });

    it('instantiates the controller defined by stagecraft API client', function () {
      var controller = processRequest.renderContent(req, res, model);
      expect(model.get('requirePath')).toEqual('/testRequirePath');
      expect(model.get('assetPath')).toEqual('/testAssetPath');
      expect(model.get('backdropUrl')).toEqual('//testBackdrop/');
      expect(model.get('environment')).toEqual('development');
      expect(controller.model).toBe(model);
      expect(controller.url).toEqual('test url');
    });

    it('sends a response once content is rendered', function () {
      var controller = processRequest.renderContent(req, res, model);
      expect(res.send).not.toHaveBeenCalled();
      controller.html = 'test content';
      controller.trigger('ready');
      expect(res.send).toHaveBeenCalledWith('test content');
    });

    it('has an explicit caching policy', function () {
      var controller = processRequest.renderContent(req, res, model);
      controller.html = 'test content';
      controller.trigger('ready');
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=600');
    });

    it('has an explicit caching policy for errors', function () {
      var ConcreteController = ErrorController.extend({
          render: jasmine.createSpy()
        });

      model = new Model({
        controller: ConcreteController
      });
      var controller = processRequest.renderContent(req, res, model);
      controller.html = 'test content';
      controller.trigger('ready');
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=5');
    });

    it('instructs search engines not to index unpublished dashboards', function () {
      model.set('published', false);
      var controller = processRequest.renderContent(req, res, model);
      controller.trigger('ready');
      expect(res.set).toHaveBeenCalledWith('X-Robots-Tag', 'none');
    });

    it('does not set a robots header when published is set to true', function () {
      model.set('published', true);
      var controller = processRequest.renderContent(req, res, model);
      controller.trigger('ready');
      expect(res.set).not.toHaveBeenCalledWith('X-Robots-Tag', 'none');
    });
  });

});
