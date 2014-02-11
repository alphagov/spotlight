define([
  'backbone',
  'common/views/govuk',
  'tpl!common/templates/prototypes.html'
],
function (Backbone, GovUkView, prototypesTemplate) {
  var PrototypesView = GovUkView.extend({

    getPageTitle: function () {
      return 'Performance prototypes - GOV.UK';
    },

    getBreadcrumbCrumbs: function () {
      return [];
    },

    getContent: function () {
      return prototypesTemplate(this.model.toJSON());
    }
  });

  return PrototypesView;
});
