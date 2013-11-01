define([
  'extensions/controllers/module',
  'common/views/module',
  'common/views/module_raw'
],
function (ModuleController, ModuleView, RawView) {
  describe("ModuleController", function () {
    describe("chooses which view to use", function () {
      it("uses a RawView when the query param raw is present", function () {
        var options = {
          raw: ''
        };
        var moduleController = new ModuleController(options);
        expect(moduleController.viewClass).toBe(RawView);
      });

      it("uses a ModuleView when the query param raw is absent", function () {
        var options = {};
        var moduleController = new ModuleController(options);
        expect(moduleController.viewClass).toBe(ModuleView);
      });
    });
  });
});
