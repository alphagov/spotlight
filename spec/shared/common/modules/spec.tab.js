define([
  'common/modules/tab',
  'extensions/models/model'
], function (TabModule, Model) {

  describe('TabModule', function () {

    var fooRender, fooModule, barRender, barModule, tabModule;

    beforeEach(function () {

      fooRender = jasmine.createSpy();
      fooModule = jasmine.createSpy().andReturn({
        render: fooRender,
        once: function () {}
      });

      barRender = jasmine.createSpy(),
      barModule = jasmine.createSpy().andReturn({
        render: barRender,
        once: function () {}
      });

      var controllerMap = {
        modules: {
            foo: fooModule,
            bar: barModule
          }
        },
        config = new Model({ tabs: [{ 'module-type': 'foo' }, { 'module-type': 'bar' }] });

      tabModule = new TabModule({
        dashboard: true,
        model: config,
        controllerMap: controllerMap
      });

    });

    it('defaults activeIndex to 0 if it is not set on model', function () {
      expect(tabModule.model.get('activeIndex')).toEqual(0);
    });

    it('should render the first tab when the module is ready on the client', function () {
      jasmine.clientOnly(function () {
        tabModule.render();

        expect(fooModule).toHaveBeenCalled();
        expect(fooRender.mostRecentCall.args[0].el.is('section')).toBe(true);
        expect(barModule).not.toHaveBeenCalled();
        expect(barRender).not.toHaveBeenCalled();
      });
    });

    it('should render all the tabs when the module is ready on the server', function () {
      jasmine.serverOnly(function () {
        tabModule.render();

        expect(fooModule).toHaveBeenCalled();
        expect(fooRender.mostRecentCall.args[0].el).toBeUndefined();
        expect(barModule).toHaveBeenCalled();
        expect(barRender.mostRecentCall.args[0].el).toBeUndefined();
      });
    });

    it('should render the tabs when the activeIndex changes', function () {
      jasmine.clientOnly(function () {
        tabModule.render();

        fooModule.reset();
        fooRender.reset();
        barModule.reset();
        barRender.reset();

        tabModule.model.set('activeIndex', 1);

        expect(fooModule).not.toHaveBeenCalled();
        expect(fooRender).not.toHaveBeenCalled();
        expect(barModule).toHaveBeenCalled();
        expect(barRender).toHaveBeenCalled();
        expect(barRender.mostRecentCall.args[0].el.is('section')).toBe(true);
      });
    });

  });

});
