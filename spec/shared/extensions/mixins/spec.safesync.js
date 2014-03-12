define([
  'extensions/mixins/safesync',
  'backbone'
],
function (SafeSync, Backbone) {
  describe('SafeSync', function () {
    describe('sync', function () {

      beforeEach(function () {
        spyOn(Backbone, 'ajax');
        SafeSync.trigger = jasmine.createSpy();
      });

      it('escapes HTML characters in received response', function () {
        var response = null;
        SafeSync.sync('get', new Backbone.Model(), {
          url: '//testurl',
          success: function (resp) { response = resp; }
        });

        var success = Backbone.ajax.argsForCall[0][0].success;
        success({'someProperty': '<b>html content</b>'});

        expect(response.someProperty).toBe('&lt;b&gt;html content&lt;/b&gt;');
      });

      it('sends a "loading" event', function () {
        SafeSync.sync('get', new Backbone.Model(), {
          url: '//testurl',
          success: function () {}
        });

        // ensure "loading" state is reset for next test
        var success = Backbone.ajax.argsForCall[0][0].success;
        success({'someProperty': '<b>html content</b>'});

        expect(SafeSync.trigger).toHaveBeenCalledWith('loading');
      });

      it('sets the "loading" property while a request is active and resets on success', function () {
        expect(SafeSync.loading).toBeFalsy();

        var response = null;
        SafeSync.sync('get', new Backbone.Model(), {
          url: '//testurl',
          success: function (resp) { response = resp; }
        });

        expect(SafeSync.loading).toBeTruthy();

        var success = Backbone.ajax.argsForCall[0][0].success;
        success({'someProperty': '<b>html content</b>'});

        expect(SafeSync.loading).toBeFalsy();
      });

      it('sets the "loading" property while a request is active and resets on error', function () {
        expect(SafeSync.loading).toBeFalsy();

        var errorArgs = {};

        SafeSync.sync('get', new Backbone.Model(), {
          url: '//testurl',
          error: function (args) {
            expect(errorArgs).toBe(args);
          }
        });

        expect(SafeSync.loading).toBeTruthy();

        var error = Backbone.ajax.argsForCall[0][0].error;
        error(errorArgs);

        expect(SafeSync.loading).toBeFalsy();
      });
    });
  });
});
