define([
  'common/collections/journey_series'
],
function (JourneyCollection) {
  return {

    requiresSvg: true,
    collectionClass: JourneyCollection,

    collectionOptions: function () {
      return {
        matchingAttribute: this.model.get('matching-attribute') || 'eventCategory',
        filterBy: this.model.get('filter-by'),
        format: {
          type: 'integer',
          magnitude: true,
          sigfigs: 3
        },
        valueAttr: this.model.get('value-attribute') || 'uniqueEvents',
        axes: _.merge({
          y: []
        }, this.model.get('axes'))
      };
    },

    visualisationOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute') || 'uniqueEvents'
      };
    }

  };
});
