define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({
    comparator: 'title',

    filterServices: function (filter) {
      filter = filter || {};
      var textFilter = (filter.text || '').toUpperCase(),
        departmentFilter = (filter.department || null);

      var filteredDashboards = this.filter(function (dashboard) {
        var title = dashboard.get('title').toUpperCase(),
          department = dashboard.get('department') || { title: '', abbr: '' },
          agency = dashboard.get('agency') || { title: '', abbr: '' };

        // Remove the dashboard from the list if it doesn't match the text filter
        var textSearchFields = [title, department.abbr.toUpperCase(), department.title.toUpperCase()];
        if (textFilter && textSearchFields.join(' ').indexOf(textFilter) === -1) {
          return false;
        }

        if (departmentFilter) {
          if (departmentFilter.indexOf('agency:') === 0) {
            if (this.getSlug(agency) !== departmentFilter.replace('agency:', '')) {
              return false;
            }
          } else {
            if (this.getSlug(department) !== departmentFilter) {
              return false;
            }
          }
        }

        return true;
      }, this);

      return filteredDashboards;
    },

    getSlug: function (organisation) {
      if (organisation.abbr) {
        return organisation.abbr.toLowerCase().replace(/ /g, '-');
      } else if (organisation.title) {
        return organisation.title.toLowerCase().replace(/ /g, '-');
      } else {
        return 'unknown-organisation';
      }
    },

    getAggregateValues: function (collectionResult) {
      collectionResult = collectionResult || this.models;
      var aggregatedValues = {
        percentages: {},
        totals: {}
      };
      var axes = this.options.axes.y;
      _.each(collectionResult, function (model) {
        _.each(axes, function (axis) {
          var axisKey = axis.key;
          var key = (axis.format === 'percent') ? 'percentages' : 'totals';
          var val = model.get(axisKey);

          if (aggregatedValues[key] && aggregatedValues[key][axisKey]) {
            if (val) {
              aggregatedValues[key][axisKey].value += val;
              aggregatedValues[key][axisKey].valueTimesVolume += (val * model.get('number_of_transactions'));
              aggregatedValues[key][axisKey].valueCount++;
            }

          } else {
            aggregatedValues[key][axisKey] = {
              title: axis.label,
              value: val || 0,
              valueTimesVolume: (val * model.get('number_of_transactions')) || 0,
              valueCount: (val) ? 1 : 0,
              format: {
                type: axis.format,
                sigfigs: 3,
                magnitude: true,
                abbr: true
              }
            };
          }
        });
      });

      _.each(axes, function (axis) {
        var key = (axis.format === 'percent') ? 'percentages' : 'totals',
          weightedAverage;

        if (aggregatedValues[key] && aggregatedValues[key][axis.key] && aggregatedValues.totals.number_of_transactions.value) {
          weightedAverage = (aggregatedValues[key][axis.key].valueTimesVolume / aggregatedValues.totals.number_of_transactions.value);
          aggregatedValues[key][axis.key].weighted_average = Math.round(weightedAverage * 100) / 100;
        }
      });

      return aggregatedValues;
    },

    filterDashboards: function () {
      var types = _.isArray(arguments[0]) ? arguments[0] : _.toArray(arguments);
      return _.map(this.filter(function (service) {
        return types.indexOf(service.get('dashboard-type')) > -1;
      }), function (m) { return m.toJSON(); });
    },

    getDepartments: function () {
      return this.getPropertyList('department');
    },

    getAgencies: function () {
      return this.getPropertyList('agency');
    },

    getPropertyList: function (prop) {
      var values = this.pluck(prop);
      values = _.filter(values, _.identity);
      values = _.sortBy(values, 'title');
      values = _.uniq(values, true, function (o) { return o.title; });
      values = _.map(values, function (a) {
        return _.extend(a, {
          slug: (a.abbr || a.title).toLowerCase().replace(/ /g, '-')
        });
      });
      return values;
    }

  }, {
    SERVICES: ['transaction', 'high-volume-transaction', 'other', 'service-group'],
    CONTENT: ['content']
  });
});
