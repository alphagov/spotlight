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
      if (this.collection) {
        this.jsonUrl = this.collection.url();
      }
      return _.extend(
        View.prototype.templateContext.call(this),
        {
          fallbackUrl: this.requiresSvg && this.url ? (this.url + '.png') : null,
          jsonUrl: this.jsonUrl,
          hasTable: this.hasTable
        }
      );
    }

  });

  return ModuleView;
});
