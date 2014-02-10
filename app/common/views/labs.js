define([
  'backbone',
  'common/views/govuk',
  'tpl!common/templates/labs.html'
],
function (Backbone, GovUkView, labsTemplate) {
  var LabsView = GovUkView.extend({

    getPageTitle: function () {
      return 'Performance Platform labs - GOV.UK';
    },

    getBreadcrumbCrumbs: function () {
      return [];
    },

    getContent: function () {
      return labsTemplate(this.model.toJSON());
    }
  });

  return LabsView;
});
