define([
  'extensions/views/view',
  'tpl!common/templates/filtered_list.html'
], function (View, Template) {

  return View.extend({

    template: Template,

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.model.on('change:filter change:departmentFilter change:agencyFilter', this.render, this);
    },

    templateContext: function () {
      var filteredList = this.collection.alphabetise({
        text: this.model.get('filter'),
        department: this.model.get('departmentFilter'),
        agency: this.model.get('agencyFilter')
      });

      return _.extend(this.model.toJSON(), {
        items: filteredList,
        title: filteredList.count === 1 ? 'service' : 'services'
      });
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      this.html = this.$el.html();
    }

  });

});