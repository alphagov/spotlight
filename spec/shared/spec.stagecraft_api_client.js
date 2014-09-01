define([
  'stagecraft_api_client',
  'extensions/models/model',
  'backbone',
],
function (StagecraftApiClient, Model, Backbone) {
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
      beforeEach(function () {
        client = new StagecraftApiClient(
          {path: 'foo'},
          {ControllerMap: ControllerMap});
      });
      describe("with a spy", function (){
        beforeEach(function () {
          spyOn(Model.prototype, 'fetch');
        });
        it('calls Model fetch with fetchFallback as the error callback', function () {
          client.fetch();

          expect(Model.prototype.fetch).toHaveBeenCalledWith({
            validate: true,
            error: client._boundFetchFallback 
          })
        });
      });
      describe('without a spy', function () {
        var old_sync;
        var fake_sync;
        beforeEach(function () {
          /*fake_sync = function (method, model, options) {*/
          /*debugger;*/
          /*}*/
          /*old_sync = Backbone.sync;*/
          /*Backbone.sync = fake_sync; */
          //how to get this to error and record what has happened so we can read urls at call both times and simplify the tests?
          spyOn(Backbone, 'sync');
        });
        /*afterEach(function () {*/
        /*Backbone.sync = old_sync;*/
        /*});*/
        it("fulfills my dreams", function () {
          client.fetch();
          debugger;
        });
      });
    });

    describe('fetchFallback', function() {
      describe('testing with a value catching fetch replacement', function(){
        var value_catcher = {};
        var client;
        var old_fetch;
        beforeEach(function () {
          client = new StagecraftApiClient(
            {path: 'foo'},
            {ControllerMap: ControllerMap});
          fake_fetch = function () {
            value_catcher['fallback_value'] = this.fallback;
          }
          old_fetch = client.fetch;
          client.fetch = fake_fetch;
        });
        afterEach(function () {
          client.fetch = old_fetch;
        })
        it('switches to fallback, calls fetch and switches back to no fallback', function () {
          expect(client.fallback).toEqual(false);
          client.fetchFallback();
          expect(value_catcher['fallback_value']).toEqual(true);
          expect(client.fallback).toEqual(false);
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
        client.stagecraftUrlRoot = 'http://boosh/';
        client.urlRoot = 'http://testdomain/';
      });
      describe('when fallback is false', function () {
        it('should use the stagecraftUrlRoot', function () {
          client.fallback = false 
          client.setPath('foo/bar');
          expect(client.url()).toEqual('http://boosh/foo/bar');
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
