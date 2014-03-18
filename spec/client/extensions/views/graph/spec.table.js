define([
  'extensions/views/graph/table',
  'extensions/views/hideShow',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (GraphTable, HideShowView, Model, Collection) {

  describe('GraphTable', function () {

    var table;

    beforeEach(function () {
      spyOn(HideShowView.prototype, 'initialize').andCallThrough();
      table = new GraphTable({
        model: new Model({
          title: 'Some title'
        }),
        collection: new Collection()
      });
    });

    describe('prepareTable', function () {

      beforeEach(function () {
        table.prepareTable();
      });

      it('adds hideshow element', function () {
        expect(table.toggleTable instanceof HideShowView).toBe(true);
        expect(table.toggleTable.$reveal).toEqual(table.$table);
      });

      it('sets toggle labels based on model title', function () {
        expect(table.toggleTable.showLabel).toEqual('Table view of some title data');
        expect(table.toggleTable.hideLabel).toEqual('Table view of some title data');
      });

    });

  });
});
