define([
  'common/views/govuk',
  'common/views/module'
],
function (GovUkView, Module) {

  var ModuleStandaloneView = GovUkView.extend({

    getContent: function () {
      var module = new Module({
        model: this.model,
        collection: this.collection,
        visualisationClass: this.visualisationClass,
        className: this.className
      });
      module.render();
      return module.$el.html();
    },

    templateContext: function () {
      var context = GovUkView.prototype.templateContext.apply(this, arguments);
      return context;
    },

    contentViewClass: null
  });

  return ModuleStandaloneView;
});
