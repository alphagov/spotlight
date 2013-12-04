define([
  'common/views/visualisations/availability/uptime-graph',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/models/query'
],
  function (Graph, Collection, Model, Query) {

    describe("configuration", function () {

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

      it("returns configuration for hour when query period is for hour", function () {
        var view = new Graph({
          collection: collectionForPeriod('hour'),
          model: new Model()
        });

        expect(view.getConfigNames()).toEqual(['stack', 'hour']);
      });

      it("returns configuration for day when query period is for day", function () {
        var view = new Graph({
          collection: collectionForPeriod('day'),
          model: new Model()
        });

        expect(view.getConfigNames()).toEqual(['stack', 'day']);
      });

    });
  });
