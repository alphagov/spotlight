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

      var title = filteredList.count === 1 ? ['service'] : ['services'];

      if (this.model.get('filter')) {
        var textFilter = _.escape(this.model.get('filter'));
        title = title.concat('matching', '<strong>', textFilter, '</strong>');
      }

      if (this.model.get('agencyFilter') || this.model.get('departmentFilter')) {
        title = title.concat('for');

        if (this.model.get('departmentFilter')) {
          var department = _.find(this.model.get('departments'), function (item) {
            return item.slug === this.model.get('departmentFilter');
          }, this);
          if (department) {
            title = title.concat(
              '<strong>',
              department.title,
              '</strong>',
              '<span class="filter-remove" data-filter="department"></span>'
            );
          }
        }

        if (this.model.get('agencyFilter') && this.model.get('departmentFilter')) {
          title = title.concat('and');
        }

        if (this.model.get('agencyFilter')) {
          var agency = _.find(this.model.get('agencies'), function (item) {
            return item.slug === this.model.get('agencyFilter');
          }, this);
          if (agency) {
            title = title.concat(
              '<strong>',
              agency.title,
              '</strong>',
              '<span class="filter-remove" data-filter="agency"></span>'
            );
          }
        }
      }

      return _.extend(this.model.toJSON(), {
        items: filteredList,
        title: title.join(' ')
      });
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      this.html = this.$el.html();
    }

  });

});