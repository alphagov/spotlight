define([
  'extensions/controllers/module'
],
function (ModuleController) {
  describe('ModuleController', function () {

    describe('id', function () {
      describe('when model slug defined', function () {

        var moduleController;
        beforeEach(function () {
          var options = {
            model: {
              get: function (key) {
                return {
                  'module-type': 'some_module',
                  'slug': 'a_slug'
                }[key];
              }
            }
          };
          moduleController = new ModuleController(options);
        });

        it('should set id from the model slug', function () {
          expect(moduleController.id()).toBe('a_slug');
        });

      });
      describe('when model slug not defined', function () {
        var moduleController;
        beforeEach(function () {
          var options = {
            model: {
              get: function (key) {
                return {
                  'module-type': 'some_module',
                }[key];
              }
            }
          };
          moduleController = new ModuleController(options);
        });

        it('should set id from the model module type', function () {
          expect(moduleController.id()).toBe('some_module');
        });
      });

    });

  });
});
