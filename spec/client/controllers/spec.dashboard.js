define([
  'client/controllers/dashboard',
  'extensions/controllers/controller',
  'backbone'
], function (DashboardController, BaseController, Backbone) {

  describe('Dashboard Controller', function () {

    var controller, model, moduleSpy, renderSpy;

    beforeEach(function () {
      renderSpy = jasmine.createSpy();
      moduleSpy = jasmine.createSpy().and.returnValue({
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
        expect(moduleSpy.calls.count()).toEqual(2);
        expect(renderSpy.calls.count()).toEqual(2);
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

      it('does not propagate cachebusting params to module pages', function () {
        controller = new DashboardController({
          model: model,
          url: '/test?v=iAmUpInYrCacheLikeBustingItLOL&soAmIm8=yesLol'
        });

        controller.render();
        expect(moduleSpy).toHaveBeenCalledWith({
          model: jasmine.any(Backbone.Model),
          url: '/test/foo'
        });
      });

      it('does not use fragments in slug generation', function () {
        controller = new DashboardController({
          model: model,
          url: '/test#hashBang'
        });

        controller.render();
        expect(moduleSpy).toHaveBeenCalledWith({
          model: jasmine.any(Backbone.Model),
          url: '/test/foo'
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
