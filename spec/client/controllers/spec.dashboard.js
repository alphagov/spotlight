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

      it('passes correct module urls to modules', function () {
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

    });

  });


});