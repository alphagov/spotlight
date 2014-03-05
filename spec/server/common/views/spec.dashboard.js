define([
  'common/views/dashboard',
  'extensions/models/model'
],
function (DashboardView, Model) {
  describe('DashboardView', function () {

    var view, model;
    beforeEach(function () {
      model = new Model({
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

    describe('getContent', function () {

      it('render content template with model data and module content', function () {
        var result = view.getContent();
        expect(result).toEqual('rendered');
        var context = view.contentTemplate.argsForCall[0][0];
        expect(context.foo).toEqual('bar');
        expect(context.modules).toEqual('<div>module 1</div><div>module 2</div>');
      });
    });

    describe('getPageTitle', function () {
      it('calculates page title from title and strapline', function () {
        model.set({
          title: 'Title',
          'strapline': 'Strapline'
        });
        expect(view.getPageTitle()).toEqual('Title - Strapline - GOV.UK');
      });

      it('calculates page title from title alone', function () {
        model.set({
          title: 'Title'
        });
        expect(view.getPageTitle()).toEqual('Title - Performance - GOV.UK');
      });
    });
  });
});
