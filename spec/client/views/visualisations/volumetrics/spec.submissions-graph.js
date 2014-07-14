define([
  'common/views/visualisations/volumetrics/submissions-graph',
  'extensions/collections/collection',
  'extensions/models/model',
  ''
],
function (SubmissionsGraph, Collection, Model) {
  describe('SubmissionsGraph', function () {

    var graph, model, collection;
    beforeEach(function () {
      model = new Model({
        'value-attribute': 'someAttr'
      });
      collection = new Collection([], {
        category: 'id',
        valueAttr: 'someAttr'
      });
      graph = new SubmissionsGraph({
        collection: collection,
        model: model,
        valueAttr: 'someAttr'
      });
    });

    describe('components', function () {
      it('should set tickFormat to seconds if the duration unit is seconds', function () {
        graph.formatOptions = {
          unit: 's',
          type: 'duration'
        };
        var tickFormat = graph.components().yaxis.options.tickFormat.call(this);
        expect(tickFormat.parse('55s').getSeconds()).toEqual(55);
      });

      it('should set tickFormat to minutes if the duration unit is minutes, and not use leading zeroes', function () {
        graph.formatOptions = {
          unit: 'm',
          type: 'duration'
        };
        var tickFormat = graph.components().yaxis.options.tickFormat.call(this);
        expect(tickFormat.parse('9m').getMinutes()).toEqual(9);
      });

    });



  });
});
