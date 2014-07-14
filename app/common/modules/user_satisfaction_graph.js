define([
  'common/collections/user-satisfaction'
],
function (UserSatisfactionCollection) {
  return {

    requiresSvg: true,
    collectionClass: UserSatisfactionCollection,

    collectionOptions: function () {
      return {
        id: 'user_satisfaction',
        title: 'User satisfaction',
        min: 1,
        max: 5,
        totalAttr: 'totalRatings',
        valueAttr: this.model.get('value-attribute'),
        axisPeriod: this.model.get('axis-period'),
        trim: this.model.get('trim') === false ? false : true,
        format: this.model.get('format') || 'integer',
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
            },
            {
              label: 'Not satisfied',
              key: 'rating_1:sum',
              format: 'integer'
            },
            {
              label: 'Dissatisfied',
              key: 'rating_2:sum',
              format: 'integer'
            },
            {
              label: 'Neither satisfied or dissatisfied',
              key: 'rating_3:sum',
              format: 'integer'
            },
            {
              label: 'Satisfied',
              key: 'rating_4:sum',
              format: 'integer'
            },
            {
              label: 'Very satisfied',
              key: 'rating_5:sum',
              format: 'integer'
            }
          ]
        }, this.model.get('axes'))
      };
    },

    visualisationOptions: function () {
      return {
        totalAttr: 'totalRatings',
        valueAttr: this.model.get('value-attribute'),
        formatOptions: this.model.get('format') || 'integer',
        url: this.url
      };
    }

  };
});
