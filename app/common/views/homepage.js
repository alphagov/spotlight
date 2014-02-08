define([
  'backbone',
  'common/views/govuk',
  'tpl!common/templates/homepage.html'
],
function (Backbone, GovUkView, homepageTemplate) {
  var HomepageView = GovUkView.extend({

    getPageTitle: function () {
      return 'Our performance - GOV.UK';
    },

    getBreadcrumbCrumbs: function () {
      return [];
    },

    getContent: function () {
      return homepageTemplate(this.model.toJSON());
    }
  });

  return HomepageView;
});
