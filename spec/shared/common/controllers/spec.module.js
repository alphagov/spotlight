define([
  'extensions/controllers/module',
  'extensions/controllers/controller',
  'common/views/module',
  'common/views/module_raw',
  'common/views/module_standalone'
],
function (ModuleController, Controller, ModuleView, RawView, StandaloneView) {
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
            dashboard: true,
            model: {
              get: function (key) {
                return {
                  "module-type": "some_module"
                }[key];
              }
            }
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

    describe("id", function () {
      describe("when model slug defined", function () {

        var moduleController
        beforeEach(function () {
          var options = {
            model: {
              get: function (key) {
                return {
                  "module-type": "some_module",
                  "slug": "a_slug"
                }[key];
              }
            }
          };
          moduleController = new ModuleController(options);
        });

        it("should set id from the model slug", function () {
          expect(moduleController.id()).toBe("a_slug");
        });

      });
      describe("when model slug not defined", function () {
        var moduleController
        beforeEach(function () {
          var options = {
            model: {
              get: function (key) {
                return {
                  "module-type": "some_module",
                }[key];
              }
            }
          };
          moduleController = new ModuleController(options);
        });

        it("should set id from the model module type", function () {
          expect(moduleController.id()).toBe("some_module");
        });
      });

    });

    describe("render", function () {

      beforeEach(function() {
        spyOn(Controller.prototype, "render");
      });

      it("does not render in non-SVG browsers when SVG is required", function () {
        jasmine.clientOnly(function () {
          var moduleController = new ModuleController({
            Modernizr: { inlinesvg: false },
            requiresSvg: true
          });
          var isReady = false;
          moduleController.once('ready', function () {
            isReady = true;
          });
          moduleController.render();
          expect(isReady).toBe(true);
          expect(Controller.prototype.render).not.toHaveBeenCalled();
        });
      });

      it("renders on the server", function () {
        jasmine.serverOnly(function () {
          var moduleController = new ModuleController({
            Modernizr: { inlinesvg: false },
            requiresSvg: true
          });
          var isReady = false;
          moduleController.once('ready', function () {
            isReady = true;
          });
          moduleController.render();
          expect(Controller.prototype.render).toHaveBeenCalled();
        });
      });

      it("renders in non-SVG browsers when SVG is not required", function () {
        jasmine.clientOnly(function () {
          var moduleController = new ModuleController({
            Modernizr: { inlinesvg: false },
            requiresSvg: false
          });
          var isReady = false;
          moduleController.once('ready', function () {
            isReady = true;
          });
          moduleController.render();
          expect(Controller.prototype.render).toHaveBeenCalled();
        });
      });

      it("renders in SVG browsers when SVG is required", function () {
        jasmine.clientOnly(function () {
          var moduleController = new ModuleController({
            Modernizr: { inlinesvg: true },
            requiresSvg: true
          });
          var isReady = false;
          moduleController.once('ready', function () {
            isReady = true;
          });
          moduleController.render();
          expect(Controller.prototype.render).toHaveBeenCalled();
        });
      });
    });

  });
});
