define([
  'client/controllers/dashboard',
  'extensions/controllers/controller',
  'backbone'
], function (DashboardController, BaseController, Backbone) {

  describe('Dashboard Controller', function () {

    var controller, model, moduleSpy, renderSpy;

    beforeEach(function () {
      renderSpy = jasmine.createSpy();
      moduleSpy = jasmine.createSpy().andReturn({
        render: renderSpy,
        once: function () {}
      });
      model = new Backbone.Model({
        modules: [
          { slug: 'foo', controller: moduleSpy },
          { slug: 'bar', controller: moduleSpy }
        ]
      });
      controller = new DashboardController({
        model: model,
        url: '/test'
      });
    });

    describe('render', function () {

      it('creates instances of modules and renders them', function () {
        controller.render();
        expect(moduleSpy.calls.length).toEqual(2);
        expect(renderSpy.calls.length).toEqual(2);
      });

      it('adds slugs to module urls', function () {
        controller.render();
        expect(moduleSpy).toHaveBeenCalledWith({
          model: jasmine.any(Backbone.Model),
          url: '/test/foo'
        });
        expect(moduleSpy).toHaveBeenCalledWith({
          model: jasmine.any(Backbone.Model),
          url: '/test/bar'
        });
      });

      it('does not add slugs to module url if page type is "module"', function () {
        model.set('page-type', 'module');
        controller.render();
        expect(moduleSpy).toHaveBeenCalledWith({
          model: jasmine.any(Backbone.Model),
          url: '/test'
        });
        expect(moduleSpy).toHaveBeenCalledWith({
          model: jasmine.any(Backbone.Model),
          url: '/test'
        });
      });

    });

  });


});