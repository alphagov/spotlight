var requirejs = require('requirejs');
var TableViewFallback = requirejs('extensions/views/table_fallback');
var Model = requirejs('extensions/models/model');
var Collection = requirejs('extensions/collections/collection');

describe('TableFallback', function () {
  describe('initialize', function () {
    var table,
      options;

    beforeEach(function () {
      options = {
        model: new Model(),
        collection: new Collection([
          { value: 01 },
          { value: 02 },
          { value: 03 },
          { value: 04 },
          { value: 05 },
          { value: 06 },
          { value: 07 }
        ])
      };
    });

    it('replaces collection with partial collection', function () {
      table = new TableViewFallback(options);
      spyOn(TableViewFallback.prototype, 'initialize');
      expect(table.collection.length).toEqual(6);
    });

  });

});
