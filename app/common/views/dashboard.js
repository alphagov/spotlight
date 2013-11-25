define([
  'common/views/govuk',
  'stache!common/templates/dashboard'
],
function (GovUkView, contentTemplate) {
  var DashboardView = GovUkView.extend({
    contentTemplate: contentTemplate,

    getContent: function () {
      var context = this.model.toJSON();

      context.modules = _.map(this.moduleInstances, function (module) {
        return module.html;
      }).join('');

      return this.contentTemplate(context);
    },

    getPageTitleItems: function () {
      return [
        this.model.get('title'),
        this.model.get('strapline')
      ];
    }
  });

  return DashboardView;
});
