define([
  'extensions/views/view',
    'client/accessibility'
],
function (View, accessibility) {

  return View.extend({

    events: {
      'click .js-sort-by': 'updateSort'
    },

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'reset', _.bind(function() {
        var unit = this.model.get('noun');
        if (this.collection.length !== 1) {
          unit += 's';
        }
        accessibility.updateLiveRegion('Totals and averages updated for ' + this.collection.length + ' ' + unit);
        this.render();
      }, this));
    },

    getAggregateValues: function () {
      var aggregateVals = this.collection.getAggregateValues();

      _.each(aggregateVals, function (kpi) {
        if (kpi.weighted_average) {
          kpi.formattedValue = this.format(kpi.weighted_average, kpi.format);
        }
      }, this);

      return aggregateVals;
    },

    updateKPIs: function (aggValues) {
      var $moreinfo,
        $link,
        linkText;

      _.each(this.collection.options.axes.y, function (kpiAxes) {
        var kpiName = kpiAxes.key,
          kpi = _.findWhere(aggValues, {key: kpiName}),
          prefixText = '',
          servicesCount = this.collection.length,
          servicesText = '';

        if (servicesCount > 1) {
          prefixText = (kpi && kpi.isWeighted) ? 'weighted average for ' : 'total for ';
        }

        if (kpi && kpi.formattedValue) {
          this.$el.find('.' + kpiName + ' .impact-number strong').removeClass('no-data')
            .html(kpi.formattedValue);

          $moreinfo = this.$el.find('.' + kpiName + ' .visualisation-moreinfo');
          $link = $moreinfo.find('.js-sort-by');

          $moreinfo.removeClass('hidden').empty();

          if (kpi.allRowsHaveValues === true) {
            if (this.collection.length === 1) {
              linkText = '1 service';
            } else {
              linkText = 'all ' + servicesCount + ' services';
            }
          } else {
            servicesText = (kpi.valueCount === 1) ? ' service' : ' services';
            linkText = kpi.valueCount + servicesText + ' out of ' + servicesCount;
          }
          $moreinfo.prepend(prefixText);
          $link.html(linkText).appendTo($moreinfo);

          if (servicesCount === 0) {
            this.$el.find('.' + kpiName + ' .visualisation-moreinfo').addClass('hidden');
          }


        } else {
          this.$el.find('.' + kpiName + ' .impact-number strong').addClass('no-data').html('no data');

          this.$el.find('.' + kpiName + ' .visualisation-moreinfo').addClass('hidden');
        }
      }, this);

    },

    updateSort: function (e) {
      var $trigger = $(e.currentTarget),
        existingSortField = this.model.get('sort-by'),
        newSortField = $trigger.attr('data-sort-by'),
        sortFieldChanged = (existingSortField !== newSortField),
        existingSortOrder = this.model.get('sort-order'),
        newSortOrder,
        $target = $($trigger.attr('href'));

      e.preventDefault();
      newSortOrder = (sortFieldChanged || (existingSortOrder === 'ascending')) ? 'descending' : 'ascending';
      this.model.set({
        'sort-by': newSortField,
        'sort-order': newSortOrder
      });

      this.model.trigger('sort-changed-external', {
        'sort-by': newSortField,
        'sort-order': newSortOrder
      });

      if ($target.length) {
        $('html, body').animate(
          { scrollTop: $target.offset().top},
          function() {
            $target.attr('tabindex', -1).focus();
          });

      }
    },

    render: function () {
      var aggValues = this.getAggregateValues();
      this.updateKPIs(aggValues);
    }

  });

});
