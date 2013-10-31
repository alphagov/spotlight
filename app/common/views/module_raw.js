define([
  'common/views/govuk',
  'common/views/module'
],
function (GovUkView, Module) {

  var ModuleRawView = GovUkView.extend({

    getContent: function () {
      var module = new Module({
        model: this.model,
        collection: this.collection,
        visualisationClass: this.visualisationClass
      });
      module.render();
      return module.$el.html();
    },

    templateContext: function () {
      var context = GovUkView.prototype.templateContext.apply(this, arguments);
      context.bodyClasses += ' raw';
      return context;
    },

    contentViewClass: null
  });

  return ModuleRawView;
});
