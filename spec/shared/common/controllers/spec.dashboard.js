define([
  'extensions/controllers/dashboard',
  'extensions/controllers/controller',
  'extensions/models/model'
],
function (Dashboard, Controller, Model) {
  describe('Dashboard', function () {
    describe('render', function () {

      var model;
      beforeEach(function () {
        spyOn(Controller.prototype, 'render');
        model = new Model();
      });

      it('renders immediately when there are no modules', function () {
        var controller = new Dashboard({
          model: model
        });
        controller.render();
        expect(Controller.prototype.render).toHaveBeenCalled();
      });

      it('renders modules and then renders itself when all modules are ready', function () {

        var Module1 = Controller.extend({
          render: jasmine.createSpy()
        });
        var Module2 = Controller.extend({
          render: jasmine.createSpy()
        });

        model.set('modules', [
          {
            controller: Module1,
            metadata: 'foo'
          },
          {
            controller: Module2,
            metadata: 'bar'
          }
        ]);

        var controller = new Dashboard({
          model: model
        });
        controller.render();

        expect(controller.moduleInstances.length).toEqual(2);

        var instances = controller.moduleInstances;

        expect(instances[0] instanceof Module1).toBe(true);
        expect(instances[0].render).toHaveBeenCalled();
        expect(instances[0].model.get('metadata')).toEqual('foo');
        expect(instances[0].model.get('parent')).toBe(model);

        expect(instances[1] instanceof Module2).toBe(true);
        expect(instances[1].render).toHaveBeenCalled();
        expect(instances[1].model.get('metadata')).toEqual('bar');
        expect(instances[1].model.get('parent')).toBe(model);

        expect(Controller.prototype.render).not.toHaveBeenCalled();
        instances[1].trigger('ready');
        expect(Controller.prototype.render).not.toHaveBeenCalled();
        instances[0].trigger('ready');
        expect(Controller.prototype.render).toHaveBeenCalled();
      });
    });
  });
});
