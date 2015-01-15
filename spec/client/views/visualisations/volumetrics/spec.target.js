define([
  'common/views/visualisations/volumetrics/target',
  'extensions/views/view',
  'extensions/collections/collection'
],
function (TargetView, View, Collection) {
  describe('TargetView', function () {

    var view, collection, $el = $('<div></div>');

    beforeEach(function () {
      collection = new Collection();
      collection.reset({
        data: [
          { count: 2, goal: 1 },
          { count: 2, goal: 2 },
          { count: 2, goal: 3 },
          { count: 2, goal: 4 },
          { count: 2, goal: 5 },
          { count: 2, goal: 6 }
        ]
      }, { parse: true });
      view = new TargetView({
        collection: collection,
        valueAttr: 'count',
        target: 3,
        pinTo: 'goal'
      });
    });

    afterEach(function () {
      view.remove();
    });

    describe('getValue()', function () {

      beforeEach(function () {
        spyOn(TargetView.prototype, 'format');
        spyOn(TargetView.prototype, 'getTargetPercent').andReturn(0.5);
      });

      it('should call the view format method with getTargetPercent()', function () {
        view.getValue();

        expect(TargetView.prototype.format).toHaveBeenCalledWith(0.5, 'percent');
      });

    });

    describe('getTargetPercent()', function () {

      beforeEach(function () {
        collection.reset({
          data: [
            { count: 2, goal: 1, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 2, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 3, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 4, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 5, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 6, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 7, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 8, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 9, values: [
              { count: 4 },
              { count: 2 }
            ]},
            { count: 2, goal: 10, values: [
              { count: 4 },
              { count: 2 }
            ]}
          ]
        }, { parse: true });

        view = new TargetView({
          collection: collection,
          valueAttr: 'count',
          target: 5,
          pinTo: 'goal'
        });
      });

      it('calculates the percentage using the target against the collection', function () {
        var targetPercent = view.getTargetPercent();

        expect(targetPercent).toEqual(0.5);
      });

      it('calculates the percentage using the target against the previous models in the collection (previous period)', function () {
        var targetPercent = view.getTargetPercent(true);

        expect(targetPercent).toEqual(0.5);
      });

    });

    describe('percentageDifference()', function () {

      beforeEach(function () {
        collection.reset({
          data: [
            { count: 2, goal: 1, values: [
              { count: 1 },
              { count: 2 }
            ]},
            { count: 2, goal: 2, values: [
              { count: 1 },
              { count: 2 }
            ]},
            { count: 2, goal: 3, values: [
              { count: 0 },
              { count: 2 }
            ]},
            { count: 2, goal: 4, values: [
              { count: 0 },
              { count: 2 }
            ]}
          ]
        }, { parse: true });

        view = new TargetView({
          collection: collection,
          valueAttr: 'count',
          target: 2,
          pinTo: 'goal'
        });

        spyOn(TargetView.prototype, 'format');
      });

      it('calculates the difference between the current target percent and the pervious period target percent', function () {
        view.percentageDifference();

        expect(TargetView.prototype.format).toHaveBeenCalledWith(-0.5, 'percent');
      });

    });

    describe('render()', function () {

      beforeEach(function () {
        collection.reset({
          data: [
            { count: 2, goal: 1, values: [
              { count: 1 },
              { count: 2 }
            ]},
            { count: 2, goal: 2, values: [
              { count: 1 },
              { count: 2 }
            ]},
            { count: 2, goal: 3, values: [
              { count: 0 },
              { count: 2 }
            ]},
            { count: 2, goal: 4, values: [
              { count: 0 },
              { count: 2 }
            ]}
          ]
        }, { parse: true });

        view = new TargetView({
          collection: collection,
          el: $el,
          valueAttr: 'count',
          target: 2,
          pinTo: 'goal'
        });
      });

      describe('the main render', function () {

        beforeEach(function () {
          spyOn(TargetView.prototype, 'getDateRange').andReturn('28 July to 3 Aug 2014');
          spyOn(TargetView.prototype, 'getValue').andReturn('50%');
          spyOn(TargetView.prototype, 'getLabel').andReturn('processed within 15 working days');
          spyOn(TargetView.prototype, 'getTargetPercent').andReturn(1);
          spyOn(TargetView.prototype, 'percentageDifference').andReturn('0%');
          spyOn(TargetView.prototype, 'getPreviousDateRange').andReturn('21 to 27 July 2014');
        });

        it('shows the correct data', function () {
          view.render();
          expect(view.$el.html()).toEqual(
            '<span class="summary">28 July to 3 Aug 2014</span>' +
            '<div class="stat"><strong>50%</strong></div>' +
            '<p class="overview">processed within 15 working days</p>' +
            '<div class="delta">' +
              '<span class="no-change">no change </span><span>on last week</span>' +
            '</div>' +
            '<p class="overview">21 to 27 July 2014</p>'
          );
        });

      });

      describe('rendering without data', function () {

        beforeEach(function () {
          collection.reset({
            data: [
              { count: 1, goal: 10, values: [
                { count: 0 },
                { count: 0 }
              ]},
            ]
          }, { parse: true });

          spyOn(TargetView.prototype, 'getDateRange').andReturn('28 July to 3 Aug 2014');
          spyOn(TargetView.prototype, 'getValue').andReturn(false);
          spyOn(TargetView.prototype, 'getTargetPercent').andReturn(1);
          spyOn(TargetView.prototype, 'getPreviousDateRange').andReturn('21 to 27 July 2014');
        });

        it('shows the correct data', function () {
          view.render();
          expect(view.$el.html()).toEqual(
            '<span class="summary">28 July to 3 Aug 2014</span>' +
            '<div class="stat no-data"><strong>no data</strong></div>' +
            '<p class="overview"></p>' +
            '<div class="delta">' +
              '<span class="no-change">no change </span><span>on last week</span>' +
            '</div>' +
            '<p class="overview">21 to 27 July 2014</p>'
          );
        });

      });

      describe('no data', function () {
        beforeEach(function () {
          collection.reset();
        });

        it('renders "no data"', function () {
          view.render();
          expect(view.$el.find('span')).toHaveClass('no-data');
          expect(view.$el.find('.no-data').text()).toEqual('(no data)');
        });
      });

      describe('the delta change', function () {

        it('shows increase delta when theres a positive change over the previous period', function () {
          collection.reset({
            data: [
              { count: 2, goal: 1, values: [
                { count: 1 },
                { count: 2 }
              ]},
              { count: 2, goal: 2, values: [
                { count: 1 },
                { count: 2 }
              ]},
              { count: 2, goal: 3, values: [
                { count: 1 },
                { count: 2 }
              ]},
              { count: 2, goal: 4, values: [
                { count: 3 },
                { count: 2 }
              ]}
            ]
          }, { parse: true });
          view.render();
          expect(view.$el.find('.delta span').attr('class')).toEqual('increase');
        });

        it('shows decrease delta when theres a negative change over the previous period', function () {
          collection.reset({
            data: [
              { count: 2, goal: 1, values: [
                { count: 1 },
                { count: 2 }
              ]},
              { count: 2, goal: 2, values: [
                { count: 1 },
                { count: 2 }
              ]},
              { count: 2, goal: 3, values: [
                { count: 1 },
                { count: 2 }
              ]},
              { count: 3, goal: 4, values: [
                { count: 1 },
                { count: 2 }
              ]}
            ]
          }, { parse: true });
          view.render();
          expect(view.$el.find('.delta span').attr('class')).toEqual('decrease');
        });
      });
    });

    describe('getLabel()', function () {

      it('shows the summary for the target percentage', function () {
        view.target = 1;
        expect(view.getLabel()).toEqual('processed within 1 working days');
      });

    });


    describe('getDateRange()', function () {

      beforeEach(function () {
        collection.reset({
          data: [
            { count: 2, goal: 1, values: [
              { count: 200 },
              { count: 400 }
            ]}
          ]
        }, { parse: true });
        spyOn(TargetView.prototype, 'formatPeriod');
      });

      it('calls formatPeriod with the last model from values', function () {
        view.getDateRange();

        expect(TargetView.prototype.formatPeriod.calls[0].args[0].toJSON()).toEqual({count: 400});
      });

    });

    describe('getPreviousDateRange()', function () {

      beforeEach(function () {
        collection.reset({
          data: [
            { count: 2, goal: 1, values: [
              { count: 200 },
              { count: 400 }
            ]}
          ]
        }, { parse: true });
        spyOn(TargetView.prototype, 'formatPeriod');
      });

      it('calls formatPeriod with the second to last model from values', function () {
        view.getPreviousDateRange();

        expect(TargetView.prototype.formatPeriod.calls[0].args[0].toJSON()).toEqual({count: 200});
      });

    });

  });
});
