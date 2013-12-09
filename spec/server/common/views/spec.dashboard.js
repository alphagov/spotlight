define([
  'common/views/dashboard',
  'extensions/models/model'
],
function (DashboardView, Model) {
  describe("DashboardView", function () {

    var view, model;
    beforeEach(function() {
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

    describe("getContent", function () {

      it("render content template with model data and module content", function () {
        var result = view.getContent();
        expect(result).toEqual('rendered');
        var context = view.contentTemplate.argsForCall[0][0];
        expect(context.foo).toEqual('bar');
        expect(context.additional_copy_class).toBeUndefined();
        expect(context.modules).toEqual('<div>module 1</div><div>module 2</div>');
      });
      
      describe("when related_pages are present on the model", function (){
        it("should include a formatted_public_timestamp in the context", function (){
          model.set({"related_pages":[{"public_timestamp":"2013-10-08T06:51:36+01:00"}]});
          var result = view.getContent();
          expect(result).toEqual('rendered');
          var context = view.contentTemplate.argsForCall[0][0];
          expect(context.foo).toEqual('bar');
          expect(context.modules).toEqual('<div>module 1</div><div>module 2</div>');
          expect(context.additional_copy_class).toEqual("with_related_pages");
        });
      });
    });

    describe("getPageTitle", function () {
      it("calculates page title from title and strapline", function () {
        model.set({
          title: 'Title',
          'strapline': 'Strapline'
        });
        expect(view.getPageTitle()).toEqual('Title - Strapline - GOV.UK');
      });

      it("calculates page title from title alone", function () {
        model.set({
          title: 'Title'
        });
        expect(view.getPageTitle()).toEqual('Title - Performance - GOV.UK');
      });
    });
  });
});
