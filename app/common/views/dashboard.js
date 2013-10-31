define([
  'common/views/govuk',
  'common/views/header',
  'stache!common/templates/dashboard'
],
function (GovUkView, HeaderView, contentTemplate) {
  var DashboardView = GovUkView.extend({
    contentTemplate: contentTemplate,

    getContent: function () {
      var context = this.model.toJSON();

      context.modules = _.map(this.model.get('modules'), function (module) {
        return module.html;
      }).join('');

      return this.contentTemplate(context);
    }
  });

  return DashboardView;
});
