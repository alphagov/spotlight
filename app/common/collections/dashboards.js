define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({
    comparator: 'title',
    alphabetise: function (filter) {
      var groups = { count: 0 };
      this.each(function (model) {
        var title = model.get('title').toUpperCase();
        var department = model.get('department') || { title: '', abbr: '' };
        filter = (filter || '').toUpperCase();

        if (!filter || title.indexOf(filter) > -1 || department.abbr.toUpperCase().indexOf(filter) > -1 || department.title.toUpperCase().indexOf(filter) > -1) {
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
