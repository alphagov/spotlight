define([
  'extensions/views/view',
  'tpl!common/templates/filtered_list.html'
], function (View, Template) {

  return View.extend({

    template: Template,

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.model.on('change:filter change:departmentFilter', this.render, this);
    },

    templateContext: function () {
      return _.extend(this.model.toJSON(), {
        items: this.collection.alphabetise({
          text: this.model.get('filter'),
          department: this.model.get('departmentFilter')
        })
      });
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      this.html = this.$el.html();
    }

  });

});