define([
    'client/views/summary-figure',
    'common/collections/dashboards',
    'extensions/models/model',
    'jquery'
  ],
  function (SummaryFigureView, DashboardCollection, Model) {

    describe('Services - summary figure', function() {

      beforeEach(function() {
        this.el = '<div class="summary-figure">' +
          '<strong class="summary-figure-count">100</strong>' +
          '<span class="summary-figure-description">' +
          '<span class="summary-figure-unit">services</span>' +
          '</span>' +
          '</div>';
        this.summary = new SummaryFigureView({
          el: this.el,
          model: new Model({
            noun: 'service'
          }),
          collection: new DashboardCollection([])
        });
      });

      it('updates when the filtered services count changes', function() {
        this.summary.collection.reset([{}, {}]);
        expect(this.summary.$el.find('.summary-figure-count').html()).toEqual('2');
        expect(this.summary.$el.find('.summary-figure-unit').html()).toEqual('services');
      });

      describe('Filter description', function() {

        it('updates when keyword filter changes', function() {
          this.summary.model.set('filter', 'test');
          this.summary.collection.reset([{}]);
          expect(this.summary.$el.find('.filter-value').html()).toEqual('"test"');
          this.summary.model.set('filter', '');
          this.summary.collection.reset([{}]);
          expect(this.summary.$el.find('.filter-value').length).toEqual(0);
        });

        it('updates when department filter changes', function() {
          this.summary.model.set('departmentFilterTitle', 'test2');
          this.summary.collection.reset([{}]);
          expect(this.summary.$el.find('.filter-value').html()).toEqual('test2');
          this.summary.model.set('departmentFilterTitle', '');
          this.summary.collection.reset([{}]);
          expect(this.summary.$el.find('.filter-value').length).toEqual(0);
        });

        it('updates when service group filter changes', function() {
          this.summary.model.set('serviceGroupFilterTitle', 'test3');
          this.summary.collection.reset([{}]);
          expect(this.summary.$el.find('.filter-value').html()).toEqual('test3');
          this.summary.model.set('serviceGroupFilterTitle', '');
          this.summary.collection.reset([{}]);
          expect(this.summary.$el.find('.filter-value').length).toEqual(0);
        });

      });

    });

  });
