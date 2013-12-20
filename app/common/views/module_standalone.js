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
        id: this.id,
        requiresSvg: this.requiresSvg,
        url: this.url
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
    },

    getBreadcrumbCrumbs: function () {
      var crumbs = [{path: '/performance', title: 'Performance'}];
      if (this.model.get('dashboard-slug') && this.model.get('dashboard-title')) {
        crumbs.push({
          path: '/performance/' + this.model.get('dashboard-slug'),
          title: this.model.get('dashboard-title')
        });
      }
      return crumbs;
    }
  });

  return ModuleStandaloneView;
});
