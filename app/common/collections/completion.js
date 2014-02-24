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
      this.startMatcher = options.startMatcher;
      this.endMatcher = options.endMatcher;
      this.matchingAttribute = options.matchingAttribute || 'eventCategory';
      this.setValueAttribute(options);
      this.period = options.period || 'week';
      this.axisPeriod = options.axisPeriod || 'week';
      this.duration = options.duration || Query.prototype.periods[this.period].duration;

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
        period: this.period
      };

      if (this.options && this.options.tabbedAttr) {
        params[this.options.tabbedAttr] = this.options.tabs[0].id;
      }

      return params;
    },

    parse: function (response) {
      this.data = response.data;

      // refresh value attribute to work with tabbed interface
      this.setValueAttribute(this.options);

      var values = [];
      var dataTotals = { start: null, end: null };
      var periods = response.data[0].values ? response.data[0].values.length : 0;

      _.times(periods, function (i) {
        var totals = _.reduce(response.data, function (memo, d) {
          if (d.values[i][this.valueAttr] > 0) {
            if (d[this.matchingAttribute].match(this.startMatcher) !== null) {
              memo.start += d.values[i][this.valueAttr];
            }
            if (d[this.matchingAttribute].match(this.endMatcher) !== null) {
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
    },

    getDataByTableFormat: function () {
      if (this.options.axisLabels && this.period) {
        var allTables = [],
          dateRow = this.options.axisLabels.x.label + ' (' + this.period + ')',
          dateKey = this.options.axisLabels.x.key,
          seriesData = this.options.axisLabels.y.key,
          tableHeadings = [];

        tableHeadings.push(dateRow, this.options.axisLabels.y.label);

        allTables.push(tableHeadings);

        _.each(this.models[0].get('values').models, function (model) {
          var tableRow = [];
          tableRow[0] = this.getMoment(model.get(dateKey))
            .format(this.periods[this.period].format.longhand);
          tableRow[1] = Math.round((model.get(seriesData) * 100)) + '%';

          allTables.push(tableRow);
        }, this);

        return allTables;
      }

      return MatrixCollection.prototype.getDataByTableFormat.apply(this, arguments);
    }

  });

  return CompletionCollection;
});
