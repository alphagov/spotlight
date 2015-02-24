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

          if (serviceFilter && service.slug !== serviceFilter) {
            return false;
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

    filterDashboards: function () {
      var types = _.isArray(arguments[0]) ? arguments[0] : _.toArray(arguments);
      return _.map(this.filter(function (service) {
        return types.indexOf(service.get('dashboard-type')) > -1;
      }), function (m) { return m.toJSON(); });
    },

    getDepartments: function () {
        return this.getPropertyList('department', true);
    },

    getAgencies: function () {
        return this.getPropertyList('agency', true);
    },

      getServices: function () {
        return this.getPropertyList('service');
      },

      getPropertyList: function (prop, makeSlug) {
      var values = this.pluck(prop);
      values = _.filter(values, _.identity);
      values = _.sortBy(values, 'title');
        values = _.uniq(values, true, function (o) {
          return o.title;
        });
        if (makeSlug === true) {
      values = _.map(values, function (a) {
        return _.extend(a, {
          slug: (a.abbr || a.title).toLowerCase().replace(/ /g, '-')
        });
      });
        }

      return values;
    }

  }, {
    SERVICES: ['transaction', 'high-volume-transaction', 'service-group'],
    CONTENT: ['content'],
    OTHER: ['other']
  });
});
