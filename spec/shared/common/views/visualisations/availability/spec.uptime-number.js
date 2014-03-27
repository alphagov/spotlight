define([
  'common/views/visualisations/availability/uptime-number',
  'common/collections/availability',
  'extensions/models/model'
],
  function (UptimeNumber, AvailabilityCollection) {

    describe('UptimeNumber', function () {

      var options = {
        checkName: 'anything',
        'data-group': 'anything',
        'data-type': 'monitoring',
        period: 'day',
        parse: true
      };

      it('should display (no data) rather than NaN when response is null', function () {
        var availabilityData = { 'data': [
          {
            'uptime:sum': null,
            'downtime:sum': null,
            'unmonitored:sum': null,
            'avgresponse:mean': null
          }
        ]};
        var collection = new AvailabilityCollection(availabilityData, options);
        var view = new UptimeNumber({
          collection: collection
        });

        expect(view.getValue()).toEqual('<span class="no-data">(no data)</span>');
      });

      it('should display (no data) when hovering over data that doesn\'t exist', function () {
        var availabilityData = { 'data': [
          {
            'uptime:sum': 13,
            'downtime:sum': 15,
            'unmonitored:sum': 17,
            'avgresponse:mean': 29
          },
          {
            'uptime:sum': null,
            'downtime:sum': null,
            'unmonitored:sum': null,
            'avgresponse:mean': null
          }
        ]};
        var collection = new AvailabilityCollection(availabilityData, options);
        var view = new UptimeNumber({
          collection: collection
        });
        collection.selectItem(0, 1);
        var selection = collection.getCurrentSelection();

        expect(view.getValueSelected(selection)).toEqual('<span class="no-data">(no data)</span>');
      });
    });
  });
