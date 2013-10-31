define([
  'stagecraft_api_client'
],
function (StagecraftApiClient) {
  describe("StagecraftApiClient", function () {

    beforeEach(function() {
      spyOn(StagecraftApiClient.prototype, "fetch");
    });

    it("retrieves data for the current path", function () {
      var client = new StagecraftApiClient();
      client.urlRoot = "http://testdomain/"
      client.setPath('foo/bar');
      expect(client.url()).toEqual("http://testdomain/foo/bar");
    });

    it("re-retrieves data when the path changes", function () {
      var client = new StagecraftApiClient({
        path: 'foo'
      });
      expect(client.fetch.callCount).toEqual(0);
      client.setPath('foo/bar');
      expect(client.fetch.callCount).toEqual(1);
      client.setPath('foo/bar');
      expect(client.fetch.callCount).toEqual(2);
    });

    describe("parse", function () {

      var client;
      beforeEach(function() {
        client = new StagecraftApiClient();
      });

      it("maps page-type 'dashboard' to DashboardController", function () {
        var data = client.parse({'page-type': 'dashboard'})
        expect(data.controller).toBe(client.controllers.dashboard);
      });

      it("maps to Error500Controller when the page type is unknown", function () {
        var data = client.parse({'page-type': 'not-implemented'})
        expect(data.controller).toBe(client.controllers.error500);
      });

      it("triggers 'unknown' event when the module type is unknown", function () {
        var triggered = false;
        client.once('unknown', function () {
          triggered = true;
        });
        var data = client.parse({'page-type': 'not-implemented'})
        expect(triggered).toBe(true);
      });

      it("maps page-type 'module' with a module-type 'realtime' to Realtime module", function () {
        var data = client.parse({
          'page-type': 'module',
          'module-type': 'realtime'
        });
        expect(data.controller).toBe(client.controllers.modules.realtime);
      });

      it("maps to Error500Controller when the module type is unknown", function () {
        var data = client.parse({
          'page-type': 'module',
          'module-type': 'not-implemented'
        });
        expect(data.controller).toBe(client.controllers.error500);
      });
    });
  });
});
