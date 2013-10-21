define([
  'extensions/models/model',
  'common/views/dashboard',
  'common/views/error404',
  'common/views/error500'
],
function (Model, DashboardView, Error404View, Error500View) {

  var ViewDirectory = Model.extend({

    viewFromStagecraftResponse: function (model) {
      if (model.get('error')) {
        return this.views.error404;
      }
      return this.views[model.get('page-type')] || this.views.error500;
    },

    views: {
      'error404': Error404View,
      'error500': Error500View,
      'dashboard': DashboardView
    }
  });

  return ViewDirectory;
});
