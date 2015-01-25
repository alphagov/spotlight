define([
    'client/views/summary-figure',
    'common/collections/dashboards',
    'extensions/models/model',
    'jquery'
  ],
  function (SummaryFigureView, DashboardCollection, Model, $) {

    describe('Services - summary figure', function() {

      it('updates when the filtered services count changes', function() {
        var $el = $('<div class="summary-figure"><strong class="summary-figure-count">100</strong><span class="summary-figure-unit">transactions</span></div>');

        this.summary = new SummaryFigureView({
          el: $el,
          model: new Model()
        });
        this.collection = new DashboardCollection([]);
        this.collection.trigger('change:filteredCount', 83);
        expect(this.summary.$el.find('.summary-figure-count').html()).toEqual('83');
      });

    });

  });