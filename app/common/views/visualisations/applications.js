define([
  'common/views/visualisations/column',
  'common/views/visualisations/target'
],
function (ColumnView, TargetView) {
  var ApplicationsView = ColumnView.extend({

    initialize: function () {
      ColumnView.prototype.initialize.apply(this, arguments);
    },

    views: function () {
      var valueAttr = this.collection.options.valueAttr;
      var formatOptions = this.collection.options.format;

      return {
        '.most-recent-number': {
          view: TargetView,
          options: {
            target: this.target,
            valueAttr: valueAttr,
            formatOptions: _.extend({}, formatOptions, { abbr: true })
          }
        }
      };

    }

  });

  return ApplicationsView;
});
