define([
  'extensions/controllers/module',
  'common/views/module',
  'common/views/module_raw',
  'common/views/module_standalone'
],
function (ModuleController, ModuleView, RawView, StandaloneView) {
  describe("ModuleController", function () {
    describe("chooses which view to use", function () {
      it("uses a ModuleView on the client side", function () {
        jasmine.clientOnly(function () {
          var moduleController = new ModuleController({});
          expect(moduleController.viewClass).toBe(ModuleView);
        });
      });

      it("uses a RawView when the query param raw is present", function () {
        jasmine.serverOnly(function () {
          var options = {
            raw: ''
          };
          var moduleController = new ModuleController(options);
          expect(moduleController.viewClass).toBe(RawView);
        });
      });

      it("uses a ModuleView when the dashboard option is present", function () {
        jasmine.serverOnly(function () {
          var options = {
            dashboard: true
          };
          var moduleController = new ModuleController(options);
          expect(moduleController.viewClass).toBe(ModuleView);
        });
      });

      it("uses a StandaloneView when no options are passed in", function () {
        jasmine.serverOnly(function () {
          var options = {};
          var moduleController = new ModuleController(options);
          expect(moduleController.viewClass).toBe(StandaloneView);
        });
      });
    });
  });
});
