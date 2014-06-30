define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({
    comparator: 'title',

    alphabetise: function (filter) {
      var groups = { count: 0 };

      filter = filter || {};
      var textFilter = (filter.text || '').toUpperCase();

      var filteredDashboards = this.filter(function (dashboard) {
        var title = dashboard.get('title').toUpperCase(),
            department = dashboard.get('department') || { title: '', abbr: '' };

        // Remove the dashboard from the list if it doesn't match the text filter
        var textSearchFields = [title, department.abbr.toUpperCase(), department.title.toUpperCase()];
        if (textFilter && textSearchFields.join(' ').indexOf(textFilter) === -1) {
          return false;
        }

        return true;
      });

      _.each(filteredDashboards, function (model) {
        var key = model.get('title').toUpperCase().substr(0, 1);
        groups[key] = groups[key] || [];
        groups[key].push(model.toJSON());
        groups.count++;
      });

      return groups;
    },

    filterDashboards: function () {
      var types = _.isArray(arguments[0]) ? arguments[0] : _.toArray(arguments);
      return _.map(this.filter(function (service) {
        return types.indexOf(service.get('dashboard-type')) > -1;
      }), function (m) { return m.toJSON(); });
    }
  }, {
    SERVICES: ['transaction', 'high-volume-transaction', 'other', 'service-group']
  });
});
