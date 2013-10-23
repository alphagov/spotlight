define([
  'extensions/views/view',
  'tpl!common/templates/error.html'
],
function (View, template) {
  var Error500View = View.extend({
    template: template,

    templateContext: function () {
      return {
        model: this.model,
        title: 'This page could not be loaded',
        description: 'Please try again later.'
      };
    }
  });

  return Error500View;
});
