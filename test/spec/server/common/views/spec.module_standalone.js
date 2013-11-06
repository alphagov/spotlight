define([
  'common/views/module_standalone',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/controllers/module',
  'extensions/views/view'
],
function (StandaloneView, Collection, Model, Module, View) {
  describe("StandaloneView", function () {
    describe("getContent", function () {
      it("renders a module", function () {
        var Visualisation = View.extend({
          render: function () {
            this.$el.html('test content');
          }
        });
        var model = new Model();
        var collection = new Collection();
        var standaloneView = new StandaloneView({
          visualisationClass: Visualisation,
          className: 'testclass',
          collection: collection,
          model: model
        });

        var content = standaloneView.getContent();
        expect(content).toContain('class="testclass"');
        expect(content).toContain('<div class="visualisation">test content</div>');
      });
    });
  });
});
