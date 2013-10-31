define([
  'extensions/mixins/safesync',
  'backbone',
  'jquery'
],
function (SafeSync, Backbone, $) {
  describe("SafeSync", function() {
    describe("sync", function () {

      var mockjaxId;
      beforeEach(function() {
        mockjaxId = $.mockjax({
          url: '//testurl',
          contentType: 'application/json',
          responseText: '{"someProperty": "<b>html content</b>"}',
          responseTime: 1
        });
        SafeSync.trigger = jasmine.createSpy();
      });
      afterEach(function() {
        $.mockjaxClear(mockjaxId);
        delete SafeSync.loading;
        delete SafeSync.trigger;
      });

      it("escapes HTML characters in received response", function () {
        var response = null;

        runs(function() {
          SafeSync.sync('get', new Backbone.Model(), {
            url: '//testurl',
            success: function(resp) { response = resp; }
          });
        });

        waitsFor(function() {
          return response !== null;
        }, "the collection should fetch the mocked response", 2000);

        runs(function() {
          expect(response.someProperty).toBe("&lt;b&gt;html content&lt;/b&gt;");
        });
      });

      it("sends a 'loading' event", function () {
        SafeSync.sync('get', new Backbone.Model(), {
          url: '//testurl',
          success: function(resp) {}
        });

        expect(SafeSync.trigger).toHaveBeenCalledWith('loading');
      });

      it("sets the 'loading' property while a request is active", function () {
        var response = null;

        runs(function() {
          expect(SafeSync.loading).toBeFalsy();
          SafeSync.sync('get', new Backbone.Model(), {
            url: '//testurl',
            success: function(resp) { response = resp; }
          });
          expect(SafeSync.loading).toBeTruthy();
        });

        waitsFor(function() {
          return response !== null;
        }, "the collection should fetch the mocked response", 2000);

        runs(function() {
          expect(SafeSync.loading).toBeFalsy();
        });
      });
    });
  });
});
