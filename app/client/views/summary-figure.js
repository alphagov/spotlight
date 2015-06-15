define([
  'extensions/views/view',
  'lodash',
  'jquery'
],
function (View, _, $) {

  return View.extend({

    templates: {
      filter: ' containing <span class="emphasis filter-value">"<%- filter %>"</span><button class="btn-remove btn-inline" data-filter="filter" type="button">×</button>',
      departmentFilterTitle: ' provided by <span class="emphasis filter-value"><%- filter %></span><button class="btn-remove btn-inline" data-filter="department" type="button">×</button>',
      serviceGroupFilterTitle: ' within <span class="emphasis filter-value"><%- filter %></span><button class="btn-remove btn-inline" data-filter="service-group" type="button">×</button>'
    },

    events: {
      'click .btn-remove': 'removeFilter'
    },

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'reset', this.render);
    },

    render: function() {
      this.$('.summary-figure-count').html(this.collection.length);
      this.updateFilterDescription();
    },

    updateFilterDescription: function() {
      var filterDescription,
        unit;

      unit = this.model.get('noun');
      if (this.collection.length !== 1) {
        unit += 's';
      }
      filterDescription = '<span class="summary-figure-unit emphasis">' + unit + '</span>';

      _.each(this.templates, function(template, key) {
        var val = this.model.get(key);
        if (val) {
          var compiled = _.template(template);
          filterDescription += compiled({ filter: val });
        }
      }, this);
      this.$el.find('.summary-figure-description')
        .empty()
        .append(filterDescription);
    },

    removeFilter: function(e) {
      var filterName = $(e.target).attr('data-filter');
      this.model.trigger('removeFilter', filterName);
    }

  });

});
