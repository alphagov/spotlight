define([
  'extensions/controllers/module',
  'extensions/models/model'
],
function (ModuleController, Model) {

  describe('ModuleController', function () {

    describe('viewOptions', function () {

      describe('when isClient is true', function () {

        describe('and the derived el is present', function () {
          beforeEach(function () {
            $('<div id="some_id"></div>').appendTo($('body'));
          });

          it('should include the correct element', function () {
            jasmine.clientOnly(function () {
              var moduleController = new ModuleController();
              var id = function () { return 'some_id'; };
              moduleController.id = id;
              expect(moduleController.viewOptions().el).toEqual($('#some_id'));
            });
          });

        });

      });

    });

    describe('className', function () {

      var moduleController;

      beforeEach(function () {
        moduleController = new ModuleController({
          model: new Model({ 'module-type': 'availability' })
        });
      });

      it('adds the module type as a className', function () {

        moduleController.model.set('module-type', 'availability');

        expect(moduleController.className()).toEqual('availability');

        moduleController.model.set('module-type', 'grouped-timeseries');

        expect(moduleController.className()).toEqual('grouped-timeseries');

      });


      it('includes any classes defined on the model', function () {

        moduleController.model.set('classes', ['foo', 'bar']);

        expect(moduleController.className()).toEqual('availability foo bar');

      });


      it('includes any classes defined on the model', function () {

        moduleController.model.set('classes', ['foo', 'bar']);
        expect(moduleController.className()).toEqual('availability foo bar');

        moduleController.model.set('classes', 'baz');
        expect(moduleController.className()).toEqual('availability baz');

      });

    });

  });

});
