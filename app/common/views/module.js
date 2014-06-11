define([
  'extensions/views/view'
],
function (View) {

  var ModuleView = View.extend({

    views: function () {
      return {
        '.visualisation-inner': {
          view: this.visualisationClass,
          options: this.visualisationOptions
        }
      };
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
    },

    templateContext: function () {
      return _.extend(
        View.prototype.templateContext.call(this),
        {
          hasTable: this.hasTable
        }
      );
    }

  });

  return ModuleView;
});
