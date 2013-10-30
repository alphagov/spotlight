define([
  'process_request',
  'extensions/models/model',
  'common/views/govuk'
],
function (process_request, Model, GovUkView) {
  describe("processRequest middleware", function () {

    var req, res, environment;
    beforeEach(function() {
      environment = 'development';
      var get = jasmine.createSpy();
      get.plan = function (id) {
        return {
          port: 1234,
          environment: environment,
          requirePath: '/testRequirePath',
          assetPath: '/testAssetPath'
        }[id];
      };
      req = {
        app: {
          get: get
        }
      };
      res = {
        status: jasmine.createSpy(),
        send: jasmine.createSpy()
      };
    });

    describe("stagecraft client setup", function () {
      var client;
      beforeEach(function() {
        client = new Model();
        client.setPath = jasmine.createSpy();
        spyOn(render, "getStagecraftApiClient").andReturn(client);
        spyOn(render, "renderContent");
      });

      it("sets up a Stagecraft API client for the Stagecraft API stub", function () {
        render(req, res);
        expect(render.getStagecraftApiClient).toHaveBeenCalled();
        expect(client.urlRoot).toEqual('http://localhost:1234/stagecraft-stub');
      });

      it("sets the current environment as an attribute", function () {
        render(req, res);
        expect(client.get('development')).toBe(true);

        environment = 'production';
        render(req, res);
        expect(client.get('development')).toBe(false);
      });

      it("renders content when stagecraft data was received successfully", function () {
        render(req, res);
        client.trigger('sync');
        expect(_.isEmpty(client._events)).toBe(true);
        expect(render.renderContent).toHaveBeenCalledWith(req, res, client);
        expect(res.status).not.toHaveBeenCalled();
      });

      it("renders content when stagecraft request failed and bubbles up error status", function () {
        render(req, res);
        var xhr = {
          status: 999
        };
        client.trigger('error', client, xhr);
        expect(_.isEmpty(client._events)).toBe(true);
        expect(render.renderContent).toHaveBeenCalledWith(req, res, client);
        expect(res.status).toHaveBeenCalledWith(999);
      });

      it("sets the response status code to 501 when stagecraft api client reports an unknown stagecraft response", function () {
        render(req, res);
        expect(res.status).not.toHaveBeenCalled();
        client.trigger('unknown');
        expect(render.renderContent).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(501);
        client.trigger('sync');
        expect(_.isEmpty(client._events)).toBe(true);
        expect(render.renderContent).toHaveBeenCalledWith(req, res, client);
      });
    });

    describe("renderContent", function () {

      var model;
      beforeEach(function() {
        model = {};
        spyOn(GovUkView.prototype, "render");
        GovUkView.prototype.render.plan = function () {
          this.html = 'test content';
        };
      });

      it("instantiates a GovUkView", function () {
        var contentView = render.renderContent(req, res, model);
        expect(contentView.requirePath).toEqual('/testRequirePath');
        expect(contentView.assetPath).toEqual('/testAssetPath');
        expect(contentView.environment).toEqual('development');
        expect(contentView.model).toBe(model);
        expect(contentView.render).toHaveBeenCalled();
      });

      it("sends a response once content is rendered", function () {
        var contentView = render.renderContent(req, res, model);
        expect(res.send).toHaveBeenCalled()
        expect(res.send.argsForCall[0][0]).toEqual('test content');
      });
    });
  });
});
