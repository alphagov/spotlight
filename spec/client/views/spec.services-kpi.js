define([
    'client/views/services-kpi',
    'common/collections/services',
    'extensions/models/model',
    'jquery'
  ],
  function (ServicesKPIView, ServicesCollection, Model, $) {

    describe('Services - KPI figures', function () {
      var servicesAxes = {
        axes: {
          x: {
            key: 'titleLink',
            label: 'Transaction name'
          },
          y: [
            {
              key: 'number_of_transactions',
              label: 'Transactions per year',
              format: 'integer'
            },
            {
              key: 'total_cost',
              label: 'Cost per year',
              format: 'currency'
            },
            {
              label: 'Cost per transaction',
              key: 'cost_per_transaction',
              format: 'currency'
            },
            {
              label: 'Digital take-up',
              key: 'digital_takeup',
              format: 'percent'
            },
            {
              label: 'User satisfaction',
              key: 'user_satisfaction_score',
              format: 'percent'
            },
            {
              label: 'Completion rate',
              key: 'completion_rate',
              format: 'percent'
            }
          ]
        }
      };

      beforeEach(function() {
        spyOn(ServicesCollection.prototype, 'getAggregateValues');
      });

      afterEach(function(){
        this.removeAllSpies();
      });

      describe('services count changes', function () {

        beforeEach(function () {
          ServicesCollection.prototype.getAggregateValues.andReturn([
            {
              'key': 'digital_takeup',
              'title': 'Digital take-up',
              'value': 0,
              'valueTimesVolume': 0,
              'valueCount': 1,
              'weighted_average': 0.143,
              'format': {
                'type': 'percent',
                'sigfigs': 3,
                'magnitude': true,
                'abbr': true
              }
            }
          ]);
        });

        it('updates figure when the filtered services count changes', function () {
          var $el = $('<div><div class="digital_takeup"><div class="impact-number"><strong>35%</strong></div></div></div>');
          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model(),
            collection: new ServicesCollection([], servicesAxes)
          });


          this.summary.collection.reset([{}]);

          expect(this.summary.$el.find('strong').html()).toEqual('14.3%');
        });

        it('makes updates available to a screenreader', function () {
          var $liveRegionContainer = $('.live-region-container');
          this.summary = new ServicesKPIView({
            el: '<div />',
            model: new Model({
              noun: 'service'
            }),
            collection: new ServicesCollection([], servicesAxes)
          });
          this.summary.collection.reset([]);
          expect($liveRegionContainer.text()).toEqual('Totals and averages updated for 0 services');
          this.summary.collection.reset([{}]);
          expect($liveRegionContainer.text()).toEqual('Totals and averages updated for 1 service');
          this.summary.collection.reset([{},{}]);
          expect($liveRegionContainer.text()).toEqual('Totals and averages updated for 2 services');
          $liveRegionContainer.remove();
        });

        it('adds a weighted average count for the kpi when the there is some results', function () {
          var $el = $('<div><div class="digital_takeup"><div class="visualisation-moreinfo hidden">weighted average for <a href="#filtered-list" class="js-sort-by">17 out of 116</a></div></div></div>');
          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model(),
            collection: new ServicesCollection([], servicesAxes)
          });

          this.summary.collection.reset([{}, {}]);

          expect(this.summary.$el.find('.visualisation-moreinfo').hasClass('hidden')).toBe(false);
          expect(this.summary.$el.find('.js-sort-by').html()).toEqual('1 service out of 2');
        });

        it('hides the weighted average summary text when the collection (results) are empty', function () {
          var $el = $('<div><div class="digital_takeup"><div class="visualisation-moreinfo">weighted average for <a href="#filtered-list" class="js-sort-by">17 out of 116</a></div></div></div>');

          ServicesCollection.prototype.getAggregateValues.andReturn([{
            'key': 'digital_takeup',
            'title': 'Digital take-up',
            'value': 0,
            'valueTimesVolume': 0,
            'valueCount': 1,
            'weighted_average': 0.14,
            'format': {
              'type': 'percent',
              'sigfigs': 3,
              'magnitude': true,
              'abbr': true
            }
          }]);

          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model(),
            collection: new ServicesCollection([], servicesAxes)
          });

          this.summary.collection.reset([]);

          expect(this.summary.$el.find('.visualisation-moreinfo').hasClass('hidden')).toBe(true);
        });

        it('sets the list sort order when the link is clicked', function () {
          var $el = $('<div><div class="digital_takeup"><div class="visualisation-moreinfo">weighted average for <a href="#filtered-list" class="js-sort-by" data-sort-by="number_of_transactions"><span class="value-count">17</span> out of <span class="filtered-count">116</span></a></div></div></div>');

          ServicesCollection.prototype.getAggregateValues.andReturn([]);

          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model({
              'sort-by': 'cost_per_transaction'
            }),
            collection: new ServicesCollection([], servicesAxes)
          });

          this.summary.collection.reset([]);
          this.summary.$el.find('.js-sort-by').click();
          expect(this.summary.model.get('sort-by')).toEqual('number_of_transactions');
          expect(this.summary.model.get('sort-order')).toEqual('descending');
          this.summary.$el.find('.js-sort-by').click();
          expect(this.summary.model.get('sort-order')).toEqual('ascending');
        });


        it('sends sort events to analytics', function() {
          var $el = $('<div><div class="digital_takeup"><div class="visualisation-moreinfo">weighted average for <a href="#filtered-list" class="js-sort-by" data-sort-by="number_of_transactions"><span class="value-count">17</span> out of <span class="filtered-count">116</span></a></div></div></div>');

          ServicesCollection.prototype.getAggregateValues.andReturn([]);

          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model({
              'sort-by': 'cost_per_transaction'
            }),
            collection: new ServicesCollection([], servicesAxes),
            analytics: {
              category: 'ppServices'
            }
          });

          spyOn(window.GOVUK.analytics, 'trackEvent');
          this.summary.$el.find('.js-sort-by').click();
          expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'summaryLinkClicked', {
            label: 'number_of_transactions',
            nonInteraction: true
          });
        });
      });


      describe('summary text updates', function () {

        it('shows a link only without prefix text when there is 1 filtered transaction', function () {
          var $el = $('<div><div class="digital_takeup"><div class="visualisation-moreinfo">weighted average for <a href="#filtered-list" class="js-sort-by" data-sort-by="number_of_transactions"><span class="value-count">17</span> out of <span class="filtered-count">116</span></a></div></div></div>');

          ServicesCollection.prototype.getAggregateValues.andReturn([{
            'key': 'digital_takeup',
            'title': 'Digital take-up',
            'value': 0,
            'valueTimesVolume': 0,
            'valueCount': 1,
            'isWeighted': true,
            'allRowsHaveValues': true,
            'weighted_average': 0.14,
            'format': {
              'type': 'percent',
              'sigfigs': 3,
              'magnitude': true,
              'abbr': true
            }
          }]);

          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model(),
            collection: new ServicesCollection([], servicesAxes)
          });
          this.summary.collection.reset([{}]);

          expect(this.summary.$el.find('.visualisation-moreinfo').text()).toEqual('1 service');

        });

        it('shows "total for all x services" when all services have values for the given KPI', function () {
          var $el = $('<div><div class="number_of_transactions"><div class="visualisation-moreinfo">weighted average for <a href="#filtered-list" class="js-sort-by" data-sort-by="number_of_transactions"><span class="value-count">17</span> out of <span class="filtered-count">116</span></a></div></div></div>');

          ServicesCollection.prototype.getAggregateValues.andReturn([{
            'key': 'number_of_transactions',
            'title': 'Transactions per year',
            'value': 0,
            'valueTimesVolume': 0,
            'valueCount': 1,
            'allRowsHaveValues': true,
            'weighted_average': 0.14,
            'format': {
              'type': 'percent',
              'sigfigs': 3,
              'magnitude': true,
              'abbr': true
            }
          }]);

          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model(),
            collection: new ServicesCollection([], servicesAxes)
          });
          this.summary.collection.reset([{}, {}, {}]);

          expect(this.summary.$el.find('.visualisation-moreinfo').text()).toEqual('total for all 3 services');

        });

        it('shows 0 when then weighted average is 0', function () {
          var $el = $('<div><div class="number_of_transactions"><div class="impact-number"><strong>35%</strong></div></div></div>');

          ServicesCollection.prototype.getAggregateValues.andReturn([{
            'key': 'number_of_transactions',
            'title': 'Transactions per year',
            'value': 0,
            'valueTimesVolume': 0,
            'valueCount': 1,
            'allRowsHaveValues': true,
            'weighted_average': 0,
            'format': {
              'type': 'percent',
              'sigfigs': 3,
              'magnitude': true,
              'abbr': true
            }
          }]);

          this.summary = new ServicesKPIView({
            el: $el,
            model: new Model(),
            collection: new ServicesCollection([], servicesAxes)
          });
          this.summary.collection.reset([{}, {}, {}]);

          expect(this.summary.$el.find('strong').html()).toEqual('0%');

        });
      });
    });

  });
