define([
  'extensions/collections/collection',
  'extensions/models/query'
],
function (Collection, Query) {

  var CompletionCollection = Collection.extend({

    initialize: function (models, options) {
      this.denominatorMatcher = options.denominatorMatcher;
      this.numeratorMatcher = options.numeratorMatcher;
      this.matchingAttribute = options.matchingAttribute || 'eventCategory';
      this.valueAttr = options.valueAttr || 'uniqueEvents:sum';
      this.collect = options.valueAttr || 'uniqueEvents:sum';
      this.period = options.period || 'week';
      this.start_at = options.startAt || null;
      this.end_at = options.endAt || null;
      this.axisPeriod = options.axisPeriod || 'week';
      this.duration = options.duration || Query.prototype.periods[this.period].duration;
      this.filterBy = options.filterBy || [];

      Collection.prototype.initialize.apply(this, arguments);
      if (!this.denominatorMatcher) {
        throw new Error('denominatorMatcher option must be provided');
      }
      if (!this.numeratorMatcher) {
        throw new Error('numeratorMatcher option must be provided');
      }
    },

    queryParams: function () {
      if (this.options.queryParams) {
        return this.options.queryParams;
      } else {
        return {
          collect: this.collect,
          duration: this.duration,
          group_by: this.matchingAttribute,
          period: this.period,
          start_at: this.start_at,
          end_at: this.end_at,
          filter_by: this.filterBy
        };
      }
    }

  });

  return CompletionCollection;
});
