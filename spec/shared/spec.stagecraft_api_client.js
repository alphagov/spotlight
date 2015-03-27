define([
  'stagecraft_api_client',
  'backbone',
],
function (StagecraftApiClient, Backbone) {
  describe('StagecraftApiClient', function () {

    var ControllerMap = {
      dashboard: function () {},
      error: function () {},
      modules: {
        realtime: function () {}
      }
    };

    describe('fetch', function (){
      var client;
      var old_sync;
      var fake_sync;
      beforeEach(function () {
        client = new StagecraftApiClient({}, {
          ControllerMap: ControllerMap
        });
        client.stagecraftUrlRoot = 'http://stagecraft';
        client.urlRoot = 'http://fallback';
        client.path = '/foo';
        old_sync = Backbone.sync;
      });
      afterEach(function () {
        this.removeAllSpies();
        Backbone.sync = old_sync;
      });
      describe('on success response', function (){
        describe('when there is no controller', function (){
          beforeEach(function () {
            fake_sync = function (method, model, options) {
              options.success({status: 200});
            };
            Backbone.sync = fake_sync;
            spyOn(Backbone, 'sync').andCallThrough();
          });
          it('it should set 501 on the client and only have one sync', function () {
            client.fetch();
            expect(Backbone.sync.calls.length).toEqual(1);
            expect(client.get('status')).toEqual(501);
          });
        });
        describe('when there is an controller', function (){
          beforeEach(function () {
            fake_sync = function (method, model, options) {
              client.set();
              options.success({status: 200, 'page-type': 'dashboard'});
            };
            Backbone.sync = fake_sync;
            spyOn(Backbone, 'sync').andCallThrough();
          });
          it('it should set 200 on the client and only have one sync', function () {
            client.fetch();
            expect(Backbone.sync.calls.length).toEqual(1);
            expect(client.get('status')).toEqual(200);
          });
        });
      });
      describe('error callback', function () {
        describe('on a 404', function (){
          beforeEach(function () {
            fake_sync = function (method, model, options) {
              options.error({status: 404, responseText: 'file not found'});
            };
            Backbone.sync = fake_sync;
            spyOn(Backbone, 'sync').andCallThrough();
          });
          it('it should set error attributes on the model', function () {
            client.fetch();
            expect(client.get('status')).toEqual(404);
            expect(client.get('errorText')).toEqual('file not found');
            expect(Backbone.sync.calls.length).toEqual(1);
          });
        });
        describe('on a 502', function (){
          beforeEach(function () {
            fake_sync = function (method, model, options) {
              options.error({status: 502, responseText: 'bad gateway'});
            };
            Backbone.sync = fake_sync;
            spyOn(Backbone, 'sync').andCallThrough();
          });
          it('it should set error attributes on the model', function () {
            client.fetch();
            expect(client.get('status')).toEqual(502);
            expect(client.get('errorText')).toEqual('bad gateway');
            expect(Backbone.sync.calls.length).toEqual(1);
          });
        });
      });
    });

    describe('url', function() {
      var client;
      beforeEach(function () {
        spyOn(StagecraftApiClient.prototype, 'fetch');
        client = new StagecraftApiClient({}, {
          ControllerMap: ControllerMap
        });
        client.stagecraftUrlRoot = 'http://stagecraft/public/dashboards';
      });
      describe('when there is a path', function () {
        it('should use the stagecraftUrlRoot with the path', function () {
          client.setPath('/foo/bar');
          expect(client.url()).toEqual('http://stagecraft/public/dashboards?slug=foo/bar');
        });
      });
      describe('when there is no path', function () {
        it('should use the stagecraftUrlRoot without a path', function () {
          client.setPath('');
          expect(client.url()).toEqual('http://stagecraft/public/dashboards');
        });
      });
    });

    describe('setPath', function (){
      beforeEach(function (){
        spyOn(StagecraftApiClient.prototype, 'fetch');
      });
      it('re-retrieves data when the path changes', function () {
        var client = new StagecraftApiClient({
          path: 'foo'
        }, {
          ControllerMap: ControllerMap
        });
        expect(client.fetch.callCount).toEqual(0);
        client.setPath('foo/bar');
        expect(client.fetch.callCount).toEqual(1);
        client.setPath('foo/bar');
        expect(client.fetch.callCount).toEqual(2);
      });

      it('does not pass query parameters onto the API request', function () {
        var client = new StagecraftApiClient({}, {
          ControllerMap: ControllerMap
        });
        client.setPath('/carers-allowance?cachebust');
        expect(client.path).toEqual('/carers-allowance');
      });
    });

    describe('parse', function () {

      var client;
      beforeEach(function () {
        client = new StagecraftApiClient({}, {
          ControllerMap: ControllerMap
        });
      });

      it('maps page-type "dashboard" to DashboardController', function () {
        var data = client.parse({'page-type': 'dashboard'});
        expect(data.controller).toBe(client.controllers.dashboard);
      });

      it('maps all modules for page-type "dashboard"', function () {
        var data = client.parse({
          'page-type': 'dashboard',
          'some-metadata': 'should be preserved',
          modules: [
            {
              'module-type': 'realtime',
              'metadata-for-module': 'preserved'
            }
          ]
        });
        expect(data.controller).toBe(client.controllers.dashboard);
        expect(data['some-metadata']).toEqual('should be preserved');
        expect(data.modules[0].controller).toBe(client.controllers.modules.realtime);
        expect(data.modules[0]['metadata-for-module']).toEqual('preserved');
      });
      it('assigns the controller map to each module including nested modules', function () {
        var data = client.parse({
          'page-type': 'dashboard',
          'some-metadata': 'should be preserved',
          'modules': [
            {
              'module-type': 'realtime',
              'metadata-for-module': 'preserved',
              'modules': [
                {
                  'module-type': 'realtime',
                  'metadata-for-module': 'preserved'
                }
              ]
            }
          ]
        });
        expect(data.modules[0].controller.map).toBe(ControllerMap.modules);
        expect(data.modules[0].modules[0].controller.map).toBe(ControllerMap.modules);
      });

      it('maps to ErrorController when the page type is unknown', function () {
        var data = client.parse({'page-type': 'not-implemented'});
        expect(data.controller).toBe(client.controllers.error);
      });

      it('maps page-type "module" to Dashboard module', function () {
        var data = client.parse({
          'page-type': 'module'
        });
        expect(data.controller).toBe(client.controllers.dashboard);
      });

      it('maps to ErrorController when the page type is unknown', function () {
        var data = client.parse({
          'page-type': 'not-known',
          modules: [{ 'module-type': 'not-implemented' }]
        });
        expect(data.controller).toBe(client.controllers.error);
      });
    });
  });
});
