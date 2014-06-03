define([
  'common/collections/user-satisfaction'
],
function (UserSatisfactionCollection) {
  return {

    collectionClass: UserSatisfactionCollection,

    collectionOptions: function () {
      return {
        id: 'user_satisfaction',
        title: 'User satisfaction',
        sortBy: '_timestamp:ascending',
        limit: 0,
        min: 1,
        max: 5,
        totalAttr: 'totalRatings',
        valueAttr: this.model.get('value-attribute'),
        period: this.model.get('period') || 'day',
        axisPeriod: this.model.get('axis-period'),
        duration: this.model.get('duration') || 30,
        trim: this.model.get('trim') === false ? false : true,
        axes: _.merge({
          x: {
            label: 'Date',
            key: '_start_at',
            format: 'date'
          },
          y: [
            {
              label: this.model.get('title'),
              key: 'rating',
              format: 'percent'
            }
          ]
        }, this.model.get('axes'))
      };
    },
    visualisationOptions: function () {
      return {
        totalAttr: 'totalRatings',
        valueAttr: this.model.get('value-attribute'),
        formatOptions: this.model.get('format')
      };
    }

  };
});
