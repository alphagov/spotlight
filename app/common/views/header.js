define([
  'extensions/views/view',
  'stache!common/templates/header'
],
function (View, template) {
  var HeaderView = View.extend({
    template: template
  });

  return HeaderView;
});
