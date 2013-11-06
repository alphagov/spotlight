define([
  'extensions/views/view',
  'stache!common/templates/module'
],
function (View, template) {

  var ModuleView = View.extend({
    template: template,

    templateContext: function () {
      var context = View.prototype.templateContext.apply(this, arguments);
      context.className = this.className;
      return context;
    },

    views: {
      ".visualisation": function() {
        return this.visualisationClass;
      }
    }

  });

  return ModuleView;
});


