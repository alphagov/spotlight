define([
  'common/modules/tab',
  'extensions/models/model'
], function (TabModule, Model) {

  describe('TabModule', function () {

    it('should render the tabs when the module is ready', function () {

      var fooRender = jasmine.createSpy('fooRender'),
          fooModule = jasmine.createSpy('fooModule')
                        .andReturn({ render: fooRender,
                                     once: function () {} });

      var barRender = jasmine.createSpy('barRender'),
          barModule = jasmine.createSpy('barModule')
                        .andReturn({ render: barRender,
                                     once: function () {} });

      var controllerMap = {
        modules: {
            foo: fooModule,
            bar: barModule
          }
        },
        config = new Model({ tabs: [{ 'module-type': 'foo' }] });

      var tabModule = new TabModule({
          dashboard: true,
          model: config,
          controllerMap: controllerMap
        });

      tabModule.render();

      expect(fooModule).toHaveBeenCalled();
      expect(fooRender.mostRecentCall.args[0].el.is('section')).toBe(true);
      expect(barModule).not.toHaveBeenCalled();
      expect(barRender).not.toHaveBeenCalled();

    });

  });

});
