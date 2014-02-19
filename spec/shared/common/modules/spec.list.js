define([
  'common/modules/list',
  'extensions/models/model'
], function (ListModule, Model) {

  describe('ListModule', function () {

    describe('extra classes are added', function () {

      it('should add some if there is an array', function () {

        var listModule = new ListModule({
          model: new Model({ 'classes': ['foo', 'bar'] })
        });

        expect(listModule.className()).toBe('list foo bar');

      });

      it('should deal with no classes', function () {
        var listModule = new ListModule({
          model: new Model()
        });

        expect(listModule.className()).toBe('list');
      });

    });

  });

});
