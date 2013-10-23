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
  });
});
