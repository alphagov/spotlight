define([
  'common/views/visualisations/availability/response-time-number',
  'common/collections/availability'
],
  function (ResponseTimeNumber, AvailabilityCollection) {

    describe('ResponseTimeNumber', function () {

      var availabilityOptions = {
        checkName: 'anything',
        dataSource: {
          'data-group': 'anything',
          'data-type': 'monitoring',
          'query-params': {
            period: 'day'
          }
        },
        parse: true
      };

      describe('getLabel', function () {

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

    });
  });
