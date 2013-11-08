define([
  'extensions/views/view',
  'stache!common/templates/module'
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


