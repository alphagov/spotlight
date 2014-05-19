define([
  'extensions/collections/matrix',
  'extensions/collections/collection',
  'extensions/models/group',
  'extensions/models/query'
],
function (MatrixCollection, Collection, Group, Query) {

  var CompletionCollection = MatrixCollection.extend({
    model: Group,

    initialize: function (models, options) {
      this.denominatorMatcher = options.denominatorMatcher;
      this.numeratorMatcher = options.numeratorMatcher;
      this.matchingAttribute = options.matchingAttribute || 'eventCategory';
      this.setValueAttribute(options);
      this.period = options.period || 'week';
      this.start_at = options.startAt || null;
      this.end_at = options.endAt || null;
      this.axisPeriod = options.axisPeriod || 'week';
      this.duration = options.duration || Query.prototype.periods[this.period].duration;
      this.filterBy = options.filterBy || [];

      MatrixCollection.prototype.initialize.apply(this, arguments);
    },

    setValueAttribute: function (options) {
      this.valueAttr = options.valueAttr ? options.valueAttr : 'uniqueEvents:sum';
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
      // refresh value attribute to work with tabbed interface
      this.setValueAttribute(this.options);

      var periods = 0,
          values = [],
          dataTotals = { start: null, end: null };

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

        dataTotals.start += totals.start;
        dataTotals.end += totals.end;
      }, this);

      var collectionAttrs = {
        values: new Collection(values).models,
        _start: dataTotals.start,
        _end: dataTotals.end
      };

      return _.extend(this.defaultCollectionAttrs(collectionAttrs), collectionAttrs);
    }

  });

  return CompletionCollection;
});
