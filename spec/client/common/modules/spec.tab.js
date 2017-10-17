define([
  'client/modules/tab',
  'extensions/models/model'
], function (TabModule, Model) {

  describe('TabModule', function () {

    var fooRender, fooModule, barRender, barModule, tabModule;

    beforeEach(function () {

      fooRender = jasmine.createSpy();
      fooModule = jasmine.createSpy().and.returnValue({
        render: fooRender,
        once: function () {}
      });

      barRender = jasmine.createSpy(),
      barModule = jasmine.createSpy().and.returnValue({
        render: barRender,
        once: function () {}
      });

      TabModule.map = {
        foo: fooModule,
        bar: barModule
      };

      var config = new Model({
        tabs: [{ 'module-type': 'foo' }, { 'module-type': 'bar' }],
        parent: new Model({ 'page-type': 'dashboard' })
      });

      tabModule = new TabModule({
        dashboard: true,
        model: config
      });

    });

    it('defaults activeIndex to 0 if it is not set on model', function () {
      expect(tabModule.model.get('activeIndex')).toEqual(0);
    });

    it('should render the first tab when the module is ready on the client', function () {

      tabModule.ready();

      expect(fooModule).toHaveBeenCalled();
      expect(fooRender).toHaveBeenCalled();
      expect(barModule).not.toHaveBeenCalled();
      expect(barRender).not.toHaveBeenCalled();
    });

    it('should render the tabs when the activeIndex changes', function () {
      tabModule.ready();
      fooModule.calls.reset();
      fooRender.calls.reset();
      barModule.calls.reset();
      barRender.calls.reset();

      tabModule.model.set('activeIndex', 1);

      expect(fooModule).not.toHaveBeenCalled();
      expect(fooRender).not.toHaveBeenCalled();
      expect(barModule).toHaveBeenCalled();
      expect(barRender).toHaveBeenCalled();
    });

  });

});
