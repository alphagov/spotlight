define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({
    comparator: 'title',

    alphabetise: function (filter) {
      var groups = { count: 0 };

      filter = filter || {};
      var textFilter = (filter.text || '').toUpperCase(),
          departmentFilter = (filter.department || null),
          agencyFilter = (filter.agency || null);

      var filteredDashboards = this.filter(function (dashboard) {
        var title = dashboard.get('title').toUpperCase(),
            department = dashboard.get('department') || { title: '', abbr: '' },
            agency = dashboard.get('agency') || { title: '', abbr: '' };

        // Remove the dashboard from the list if it doesn't match the text filter
        var textSearchFields = [title, department.abbr.toUpperCase(), department.title.toUpperCase()];
        if (textFilter && textSearchFields.join(' ').indexOf(textFilter) === -1) {
          return false;
        }

        if (departmentFilter && this.getSlug(department) !== departmentFilter) {
          return false;
        }

        if (agencyFilter && this.getSlug(agency) !== agencyFilter) {
          return false;
        }

        return true;
      }, this);

      _.each(filteredDashboards, function (model) {
        var key = model.get('title').toUpperCase().substr(0, 1);
        groups[key] = groups[key] || [];
        groups[key].push(model.toJSON());
        groups.count++;
      });

      return groups;
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
