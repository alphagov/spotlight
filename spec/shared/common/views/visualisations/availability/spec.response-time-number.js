define([
  'common/views/visualisations/availability/response-time-number',
  'extensions/collections/collection',
  'common/collections/availability',
  'extensions/models/model'
],
  function (ResponseTimeNumber, Collection, AvailabilityCollection, Model) {

    describe('ResponseTimeNumber', function () {

      var availabilityOptions = {
        checkName: 'anything',
        'data-group': 'anything',
        'data-type': 'monitoring',
        parse: true
      };

      function collectionForPeriod(period) {
        var CollectionWithPeriod =  Collection.extend({
          queryParams: function () {
            return {
              period: period
            };
          }
        });

        return new CollectionWithPeriod();
      }

      describe('getLabel', function () {
        it('display label for last 24 hours', function () {
          var view = new ResponseTimeNumber({
            collection: collectionForPeriod('hour')
          });

          expect(view.getLabel()).toEqual('mean for the last 24 hours');
        });

        it('display label for last 30 days', function () {
          var view = new ResponseTimeNumber({
            collection: collectionForPeriod('day')
          });

          expect(view.getLabel()).toEqual('mean for the last 30 days');
        });

        it('should display (no data) when there is no data available', function () {
          var availabilityData = { 'data': [
            {
              'avgresponse:mean': null
            }
          ]};
          var collection = new AvailabilityCollection(availabilityData, availabilityOptions);
          var view = new ResponseTimeNumber({
            collection: collection
          });

          expect(view.getValue()).toEqual('<span class="no-data">(no data)</span>');
        });
      });


      describe('getLabelSelected', function () {
        it('display hour range and day for hour query', function () {
          var view = new ResponseTimeNumber({
            collection: collectionForPeriod('hour')
          });

          var selection = new Model();
          selection.set('_start_at', view.getMoment('2013-06-18T01:00:00+00:00'));
          selection.set('_end_at', view.getMoment('2013-06-18T02:00:00+00:00'));

          expect(view.getLabelSelected({ selectedModel: selection })).toEqual('1am to 2am,<br>18 June 2013');
        });

        it('display only date for day query', function () {
          var view = new ResponseTimeNumber({
            collection: collectionForPeriod('day')
          });

          var selection = new Model();
          selection.set('_start_at', view.getMoment('2013-05-17T00:00:00+00:00'));
          selection.set('_end_at', view.getMoment('2013-05-18T00:00:00+00:00'));

          expect(view.getLabelSelected({ selectedModel: selection })).toEqual('Friday <span class="fulldate">17 May 2013</span>');
        });

        it('should display (no data) when the selected data is unavailable', function () {
          var availabilityData = { 'data': [
            {
              'avgresponse:mean': 123
            },
            {
              'avgresponse:mean': null
            }
          ]};
          var collection = new AvailabilityCollection(availabilityData, availabilityOptions);
          var view = new ResponseTimeNumber({
            collection: collection
          });
          collection.selectItem(0, 1);
          var selection = collection.getCurrentSelection();

          expect(view.getValueSelected(selection)).toEqual('<span class="no-data">(no data)</span>');
        });

      });
    });
  });
