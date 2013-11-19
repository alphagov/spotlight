define([
  'extensions/views/view',
  'tpl!common/templates/module.html'
],
function (View, template) {

  var ModuleView = View.extend({
    template: template,
    tagName: 'section',

    views: {
      ".visualisation": function() {
        return this.visualisationClass;
      }
    }

  });

  return ModuleView;
});


