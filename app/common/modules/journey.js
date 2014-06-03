define([
  'common/collections/journey'
],
function (JourneyCollection) {
  return {

    collectionClass: JourneyCollection,

    collectionOptions: function () {
      return {
        matchingAttribute: this.model.get('matching-attribute'),
        filterBy: this.model.get('filter-by'),
        format: {
          type: 'integer',
          magnitude: true,
          sigfigs: 3
        },
        axes: _.merge({
          y: []
        }, this.model.get('axes'))
      };
    }

  };
});
