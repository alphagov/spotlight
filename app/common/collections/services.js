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
        if (!filter || title.indexOf(filter.toUpperCase()) > -1) {
          var key = title.substr(0, 1);
          groups[key] = groups[key] || [];
          groups[key].push(model.toJSON());
          groups.count++;
        }
      });
      return groups;
    },
    columns: function (n) {
      var services = this.filter(function (service) {
        return service.get('dashboard-type') !== 'high-volume-transaction';
      });
      var num = Math.ceil(services.length / n);
      var output = [[]];
      var col = 0;

      _.each(services, function (service) {
        if (output[col].length === num) {
          col++;
        }
        output[col] = output[col] || [];
        output[col].push(service.toJSON());
      });

      return [output];
    }
  });
});