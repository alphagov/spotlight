define([
  'common/views/dashboard',
  'extensions/models/model'
],
function (DashboardView, Model) {
  describe("DashboardView", function () {
    describe("getContent", function () {

      var view;
      beforeEach(function() {
        var model = new Model({
          foo: 'bar'
        });
        view = new DashboardView({
          model: model,
          contentTemplate: jasmine.createSpy().andReturn('rendered')
        });
        view.moduleInstances = [
          { html: '<div>module 1</div>'},
          { html: '<div>module 2</div>'}
        ];
      });

      it("render content template with model data and module content", function () {
        var result = view.getContent();
        expect(result).toEqual('rendered');
        var context = view.contentTemplate.argsForCall[0][0];
        expect(context.foo).toEqual('bar');
        expect(context.modules).toEqual('<div>module 1</div><div>module 2</div>');
      });
    });
  });
});
