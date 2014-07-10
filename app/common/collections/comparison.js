define([
  'extensions/collections/collection'/*,
  'common/collections/grouped_timeshift'*/
],
function (Collection/*, TimeshiftCollection*/) {

  return Collection.extend({
    /*initialize: function (models, options) {
      options.collections = _.map(options.comparison, function (param) {
        return {
          collection: TimeshiftCollection.extend({}),
          options: {
            filterBy: options.filterBy.concat(param),
            axes: {
              x: options.axes.x,
              y: _.filter(options.axes.y, function (axis) {
                return axis.comparison === param;
              })
            }
          }
        };
      });
      delete options.filterBy;
      return Collection.prototype.initialize.apply(this, arguments);
    },
    parse: function () {
      var collections = [];
      _.each(this.collectionInstances, function (collection) {
        collection.each(function (model, index) {
          collections.push({
            id: model.id,
            title: model.get('title'),
            timeshift: model.get('timeshift'),
            className: 'compare-group' + index,
            values: model.get('values').toJSON()
          });
        });
      });
      return collections;
    }*/
  });

});
