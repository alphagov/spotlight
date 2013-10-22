define([
  'common/views/dashboard',
  'common/views/error404',
  'common/views/error500'
],
function (DashboardView, Error404View, Error500View) {

  var ViewMap = {
    'error404': Error404View,
    'error500': Error500View,
    'dashboard': DashboardView
  };

  return ViewMap;
});
