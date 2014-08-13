define([
  'client/views/visualisations/bar-chart/bar',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (Bar, Collection, Model) {

  describe('Bar', function () {

    describe('text', function () {

      var graph = {
        valueAttr: 'val',
        on: function () { }
      };

      it('should display no data for null', function () {
        var model = new Model({ val: null }),
            bar = new Bar({ graph: graph, collection: new Collection() });

        expect(bar.text(model)).toEqual('(no data)');

      });

      it('should display no data for undefined', function () {
        var model = new Model({ val: undefined }),
            bar = new Bar({ graph: graph, collection: new Collection() });

        expect(bar.text(model)).toEqual('(no data)');

      });

      it('should display no data for NaN', function () {
        var model = new Model({ val: NaN }),
            bar = new Bar({ graph: graph, collection: new Collection() });

        expect(bar.text(model)).toEqual('(no data)');

      });

      it('should display 0 if 0', function () {
        var model = new Model({ val: 0 }),
            bar = new Bar({ graph: graph, collection: new Collection({},
              { 'format': { 'type': 'integer' }
            }) });

        expect(bar.text(model)).toEqual('0');

      });

      it('should display 10 if 10', function () {
        var model = new Model({ val: 10 }),
        bar = new Bar({
          graph: graph,
          collection: new Collection(
            {},
            { 'format': { 'type': 'integer' }
          })
        });

        expect(bar.text(model)).toEqual('10');

      });

      it('should display 10% if the percent option is set', function () {
        var model = new Model({ val: 0.1 }),
            bar = new Bar({ graph: graph, collection: new Collection({},
              { 'format': { 'type': 'percent' }
            }) });

        expect(bar.text(model)).toEqual('10%');

      });

    });

  });

});
