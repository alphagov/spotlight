define([
  'client/views/visualisations/single-stat-graph',
  'extensions/collections/collection',
  'extensions/models/model',
  ''
],
function (SingleStatGraph, Collection, Model) {
  describe('Single Stat Graph', function () {

    var graph, model, collection;
    beforeEach(function () {
      model = new Model({
        'value-attribute': 'someAttr'
      });
      collection = new Collection([], {
        category: 'id',
        valueAttr: 'someAttr'
      });
      graph = new SingleStatGraph({
        collection: collection,
        model: model,
        valueAttr: 'someAttr'
      });
    });

    describe('components', function () {
      it('should set tickFormat to seconds if the duration unit is seconds', function () {
        graph.formatOptions = {
          unit: 's',
          type: 'duration',
          dps: 0
        };
        var tickFormat = graph.components().yaxis.options.tickFormat.call(this);
        expect(tickFormat(9000)).toEqual('9s');
      });

      it('should set tickFormat to minutes if the duration unit is minutes, and not use leading zeroes', function () {
        graph.formatOptions = {
          unit: 'm',
          type: 'duration'
        };
        var tickFormat = graph.components().yaxis.options.tickFormat.call(this);
        expect(tickFormat(125000)).toEqual('2m 5s');
      });

      it('does not add seconds if the duration is a whole number of minutes', function () {
        graph.formatOptions = {
          unit: 'm',
          type: 'duration'
        };
        var tickFormat = graph.components().yaxis.options.tickFormat.call(this);
        expect(tickFormat(120000)).toEqual('2m');
      });

      it('should format ticks as percentages if specified', function () {
        graph.formatOptions = {
          type: 'percent'
        };
        var tickFormat = graph.components().yaxis.options.tickFormat.call(this);
        expect(tickFormat(120000)).toContain('%');
      });

    });



  });
});
