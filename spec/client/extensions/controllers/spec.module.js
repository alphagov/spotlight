define([
  'extensions/controllers/module',
  'extensions/models/model'
],
function (ModuleController, Model) {

  describe('ModuleController', function () {

    describe('className', function () {

      var moduleController;

      beforeEach(function () {
        moduleController = new ModuleController({
          model: new Model({ 'module-type': 'availability', 'value-attribute': 'someAttr' })
        });
      });

      it('adds the module type as a className', function () {

        moduleController.model.set('module-type', 'availability');

        expect(moduleController.className()).toEqual('module availability');

        moduleController.model.set('module-type', 'grouped-timeseries');

        expect(moduleController.className()).toEqual('module grouped-timeseries');

      });


      it('includes any classes defined on the model', function () {

        moduleController.model.set('classes', ['foo', 'bar']);

        expect(moduleController.className()).toEqual('module availability foo bar');

      });


      it('includes any classes defined on the model', function () {

        moduleController.model.set('classes', ['foo', 'bar']);
        expect(moduleController.className()).toEqual('module availability foo bar');

        moduleController.model.set('classes', 'baz');
        expect(moduleController.className()).toEqual('module availability baz');

      });

      it('returns valueAttr in the visualisation options', function () {

        moduleController.model.set('classes', ['foo', 'bar']);
        expect(moduleController.visualisationOptions().valueAttr).toEqual('someAttr');

      });

    });

  });

});
