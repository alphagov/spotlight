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
      describe('on all error responses', function (){
        var client;
        var old_sync;
        var fake_sync;
        var url_values = [];
        var fallback_values = [];
        beforeEach(function () {
          client = new StagecraftApiClient({}, {
            ControllerMap: ControllerMap
          });
          client.stagecraftUrlRoot = 'http://stagecraft';
          client.urlRoot = 'http://fallback/';
          client.path = 'foo';
          //This ensures the error callback happens without 
          //making a request. It also stores the values during calls.
          fake_sync = function (method, model, options) {
            url_values.push(model.url()); 
            fallback_values.push(model.fallback); 
            options.error({status: 404, responseText: 'all responses where 404!'});
          }
          old_sync = Backbone.sync;
          Backbone.sync = fake_sync; 
          //This records the number of calls made. 
          spyOn(Backbone, 'sync').andCallThrough();
        });
        afterEach(function () {
          this.removeAllSpies();
          Backbone.sync = old_sync;
        });
        it("it should attempt to call stagecraft, it should fallback to local config, it should set error attributes on the model", function () {
          expect(client.fallback).toEqual(false);
          client.fetch();
          expect(client.fallback).toEqual(false);
          expect(client.get('status')).toEqual(404);
          expect(client.get('errorText')).toEqual('all responses where 404!');
          expect(Backbone.sync.calls.length).toEqual(2);
          //we cannot use the spy to determine the calls as 
          //it will give the values set on model at the point fetch 
          //has returned, we must store the values during the sync call
          expect(url_values[0]).toEqual('http://stagecraft?slug=foo');
          expect(url_values[1]).toEqual('http://fallback/foo');
          expect(fallback_values[0]).toEqual(false);
          expect(fallback_values[1]).toEqual(true);
        });
      });
    });

    describe('testing client.url', function() {
      var client;
      beforeEach(function () {
        spyOn(StagecraftApiClient.prototype, 'fetch');
        client = new StagecraftApiClient({}, {
          ControllerMap: ControllerMap
        });
        client.stagecraftUrlRoot = 'http://boosh';
        client.urlRoot = 'http://testdomain/';
      });
      describe('when fallback is false', function () {
        it('should use the stagecraftUrlRoot', function () {
          client.fallback = false 
          client.setPath('foo/bar');
          expect(client.url()).toEqual('http://boosh?slug=foo/bar');
        });
      });
      describe('when fallback is true', function () {
        it('should use the urlRoot', function () {
          client.fallback = true 
          client.setPath('foo/bar');
          expect(client.url()).toEqual('http://testdomain/foo/bar');
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
