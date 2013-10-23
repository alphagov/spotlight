define([
  'extensions/views/view',
  'tpl!common/templates/error.html'
],
function (View, template) {
  var Error404View = View.extend({
    template: template,

    templateContext: function () {
      return {
        model: this.model,
        title: 'This page cannot be found',
        description: 'Please check that you have entered the correct web address.'
      };
    }
  });

  return Error404View;
});
