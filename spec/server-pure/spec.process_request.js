var requirejs = require('requirejs');
var _ = require('lodash');

var processRequest = require('../../app/process_request');

var Model = requirejs('extensions/models/model');
var Controller = requirejs('extensions/controllers/controller');
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
        backdropUrl: '//testBackdrop/'
      }[id];
    };
    req = {
      app: {
        get: get
      },
      originalUrl: 'test url',
      route: {},
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
      spyOn(processRequest, 'getStagecraftApiClient').andReturn(client);
      spyOn(processRequest, 'renderContent');
    });

    it('sets up a Stagecraft API client for the Stagecraft API stub', function () {
      processRequest(req, res);
      expect(processRequest.getStagecraftApiClient).toHaveBeenCalled();
      expect(client.urlRoot).toEqual('http://localhost:1234/stagecraft-stub');
    });

    it('removes the /performance part of the slug when setting the path', function () {
      processRequest(req, res);
      expect(client.setPath).toHaveBeenCalledWith('/carers-allowance');
    });

    it('renders content when stagecraft data was received successfully', function () {
      processRequest(req, res);
      client.trigger('sync');
      expect(_.isEmpty(client._events)).toBe(true);
      expect(processRequest.renderContent).toHaveBeenCalledWith(req, res, client);
    });

    it('renders content when stagecraft request failed and bubbles up error status', function () {
      processRequest(req, res);
      client.set('status', 999);
      client.trigger('error', client);
      expect(_.isEmpty(client._events)).toBe(true);
      expect(processRequest.renderContent).toHaveBeenCalledWith(req, res, client);
      expect(res.status).toHaveBeenCalledWith(999);
    });

    it('sets the response status code to 501 when stagecraft api client reports an unknown stagecraft response', function () {
      processRequest(req, res);
      expect(res.status).not.toHaveBeenCalled();
      client.set('status', 501);
      expect(processRequest.renderContent).not.toHaveBeenCalled();
      client.trigger('sync');
      expect(res.status).toHaveBeenCalledWith(501);
      expect(_.isEmpty(client._events)).toBe(true);
      expect(processRequest.renderContent).toHaveBeenCalledWith(req, res, client);
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
      expect(controller.render).toHaveBeenCalled();
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
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=120');
    });
  });

});
