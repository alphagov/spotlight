define([
  'common/views/module_standalone',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/controllers/module',
  'extensions/views/view'
],
function (StandaloneView, Collection, Model, Module, View) {
  describe("StandaloneView", function () {

    var standaloneView, model, collection;
    beforeEach(function() {
      var Visualisation = View.extend({
        render: function () {
          this.$el.html('test content');
        }
      });
      model = new Model();
      collection = new Collection();
      standaloneView = new StandaloneView({
        visualisationClass: Visualisation,
        className: 'testclass',
        collection: collection,
        model: model
      });
    });

    describe("getContent", function () {
      it("renders a module", function () {
        var content = standaloneView.getContent();
        expect(content).toContain('class="testclass"');
        expect(content).toContain('<div class="visualisation">test content</div>');
      });
    });

    describe("getPageTitle", function () {
      it("calculates page title from title and dashboard information", function () {
        model.set({
          title: 'Title',
          'dashboard-title': 'Dashboard',
          'dashboard-strapline': 'Strapline'
        });
        expect(standaloneView.getPageTitle()).toEqual('Title - Dashboard - Strapline - GOV.UK');
      });

      it("calculates page title from title alone", function () {
        model.set({
          title: 'Title'
        });
        expect(standaloneView.getPageTitle()).toEqual('Title - Performance - GOV.UK');
      });
    });
  });
});
