define([
  'extensions/collections/collection',
  'extensions/models/group',
  'extensions/models/query'
],
function (Collection, Group, Query) {

  var CompletionCollection = Collection.extend({
    model: Group,

    initialize: function (models, options) {
      this.denominatorMatcher = options.denominatorMatcher;
      this.numeratorMatcher = options.numeratorMatcher;
      this.matchingAttribute = options.matchingAttribute || 'eventCategory';
      this.valueAttr = options.valueAttr || 'uniqueEvents:sum';
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
      var params = {
        collect: this.valueAttr,
        duration: this.duration,
        group_by: this.matchingAttribute,
        period: this.period,
        start_at: this.start_at,
        end_at: this.end_at,
        filter_by: this.filterBy
      };

      if (this.options && this.options.tabbedAttr) {
        params[this.options.tabbedAttr] = this.options.tabs[0].id;
      }

      params = _.extend(params, (this.options.queryParams || {}));

      return params;
    },

    parse: function (response) {

      var periods = 0,
          values = [];

      if (response.data && response.data.length > 0 && response.data[0].values) {
        periods = response.data[0].values.length;
      }
      _.times(periods, function (i) {
        var totals = _.reduce(response.data, function (memo, d) {
          if (d.values[i][this.valueAttr] !== null) {
            if (d[this.matchingAttribute].match(this.denominatorMatcher) !== null) {
              memo.start += d.values[i][this.valueAttr];
            }
            if (d[this.matchingAttribute].match(this.numeratorMatcher) !== null) {
              memo.end += d.values[i][this.valueAttr];
            }
          }
          return memo;
        }, {start: null, end: null}, this);

        var value = {
          _start_at: this.getMoment(response.data[0].values[i]._start_at),
          _end_at: this.getMoment(response.data[0].values[i]._end_at),
          _start: totals.start,
          _end: totals.end
        };
        values.push(_.extend(this.defaultValueAttrs(value), value));

      }, this);

      return values;
    }

  });

  return CompletionCollection;
});
