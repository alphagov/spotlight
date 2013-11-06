define([
  'extensions/controllers/controller',
  'common/views/error'
],
function (Controller, ErrorView) {
  var ErrorController = Controller.extend({
    viewClass: ErrorView
  });

  return ErrorController;
});
