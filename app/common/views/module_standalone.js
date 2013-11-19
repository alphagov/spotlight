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
      return module.$el[0].outerHTML;
    },

    getPageTitleItems: function () {
      return [
        this.model.get('title'),
        this.model.get('dashboard-title'),
        this.model.get('dashboard-strapline')
      ];
    }
  });

  return ModuleStandaloneView;
});
