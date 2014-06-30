define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({
    comparator: 'title',

    alphabetise: function (filter) {
      var groups = { count: 0 };

      filter = filter || {};

      this.each(function (model) {
        var title = model.get('title').toUpperCase(),
            department = model.get('department') || { title: '', abbr: '' },
            textFilter = (filter.text || '').toUpperCase();

        if (!textFilter || title.indexOf(textFilter) > -1 || department.abbr.toUpperCase().indexOf(textFilter) > -1 || department.title.toUpperCase().indexOf(textFilter) > -1) {
          var key = title.substr(0, 1);
          groups[key] = groups[key] || [];
          groups[key].push(model.toJSON());
          groups.count++;
        }
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
