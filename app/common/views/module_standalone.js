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
        className: this.className,
        requiresSvg: this.requiresSvg,
        url: this.url
      });
      module.render();
      return module.$el[0].outerHTML;
    }
  });

  return ModuleStandaloneView;
});
