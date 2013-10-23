define([
  'extensions/views/view',
  'common/views/header',
  'stache!common/templates/dashboard'
],
function (View, HeaderView, template) {
  var DashboardView = View.extend({
    template: template,

    views: {
      header: HeaderView
    }
  });

  return DashboardView;
});
