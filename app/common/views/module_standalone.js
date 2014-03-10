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
      var crumbs = [
        {path: '/performance', title: 'Performance'}
      ];
      var crumbNames = ['department', 'agency', 'service', 'policy'];
      _.each(crumbNames, function (cn) {
        if (this.model.get(cn)) {
          crumbs.push({
            'title': this.model.get(cn).title
          });
        }
      }, this);
      return crumbs;
    }
  });

  return ModuleStandaloneView;
});
