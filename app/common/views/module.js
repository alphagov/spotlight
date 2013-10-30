define([
  'extensions/views/view'
],
function (View) {

  var ModuleView = View.extend({
    template: moduleTemplate,

    views: {
      ".visualisation": function() {
        return this.visualisationClass;
      }
    }

  });

  return RawView;
});


