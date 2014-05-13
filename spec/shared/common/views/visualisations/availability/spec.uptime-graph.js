define([
  'common/views/visualisations/availability/uptime-graph',
  'extensions/collections/collection'
],
  function (Graph, Collection) {

    describe('Uptime Graph', function () {

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

      it('returns configuration for hour when query period is for hour', function () {
        var view = new Graph({
          collection: collectionForPeriod('hour')
        });

        expect(view.getConfigNames()).toEqual(['hour']);
      });

      it('returns configuration for day when query period is for day', function () {
        var view = new Graph({
          collection: collectionForPeriod('day')
        });

        expect(view.getConfigNames()).toEqual(['day']);
      });

    });
  });
