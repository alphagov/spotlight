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

    templateContext: function () {
      return _.extend(
        View.prototype.templateContext.call(this),
        {
          hasTable: this.hasTable,
          datePicker: this.hasDatePicker
        }
      );
    }

  });

  return ModuleView;
});
