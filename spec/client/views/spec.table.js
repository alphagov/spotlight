define([
  'client/views/table',
  'extensions/views/table',
  'extensions/collections/collection',
  'jquery',
  'modernizr'
],
function (Table, BaseTable, Collection, $, Modernizr) {
  describe('Table', function () {
    describe('initialize', function () {
      var table;
      beforeEach(function () {
        spyOn(Table.prototype, 'renderSort');
        spyOn(Table.prototype, 'syncToTableCollection');
        spyOn(BaseTable.prototype, 'initialize');
        table = new Table({
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'hello world'
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          }),
        });
      });

      it('listens to sort on the tableCollection', function () {
        table.tableCollection.trigger('sort');
        expect(table.renderSort).toHaveBeenCalled();
      });

      it('listens to sync on the collection', function () {
        table.collection.trigger('sync');
        expect(table.syncToTableCollection).toHaveBeenCalled();
      });

      it('calls initialize on TableView', function () {
        expect(BaseTable.prototype.initialize).toHaveBeenCalled();
      });
    });

    describe('syncToTableCollection', function () {
      var table;
      beforeEach(function () {
        table = new Table({
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'model 1'
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          }),
        });
      });

      it('copies the models from the collection to the tableCollection', function () {
        expect(table.collection.at(0).get('value')).toEqual('model 1');
        expect(table.tableCollection.at(0).get('value')).toEqual('model 1');

        table.collection.reset([{
          '_timestamp': '2014-07-03T13:17:04+00:00',
          value: 'model 2'
        }]);

        expect(table.collection.at(0).get('value')).toEqual('model 2');
        expect(table.tableCollection.at(0).get('value')).toEqual('model 1');

        table.syncToTableCollection();

        expect(table.collection.at(0).get('value')).toEqual('model 2');
        expect(table.tableCollection.at(0).get('value')).toEqual('model 2');
      });
    });

    describe('renderSort', function () {
      var table;
      beforeEach(function () {
        spyOn(BaseTable.prototype, 'renderBody');
        spyOn(Table.prototype, 'render');
        table = new Table({
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'model 1'
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          }),
        });
      });

      it('removes the tbody', function () {
        //put something into the tbody
        table.prepareTable();
        table.$table.html('<tbody><tr><td>1234</td></tr></tbdoy>');

        expect(table.$table.find('tbody').length).toEqual(1);
        table.renderSort();

        expect(table.$table.find('tbody').length).toEqual(0);
      });

      it('calls renderBody with the tableCollection', function () {
        table.tableCollection = 'foo';

        expect(table.renderBody).not.toHaveBeenCalled();

        table.renderSort();

        expect(table.renderBody).toHaveBeenCalledWith('foo');
      });

      it('calls render', function () {

        expect(table.render).not.toHaveBeenCalled();

        table.renderSort();

        expect(table.render).toHaveBeenCalled();

      });
    });

    describe('sortCol', function () {
      var table;

      beforeEach(function () {
        var $el = $('<div/>');
        $el.html(
          '<table><thead><tr><th scope="col" width="0"><a href="#">date</a></th>' +
          '<th scope="col" width="0"><a href="#">another</a></th></tr></thead><tbody><tr><td class="" width="0">2014-07-03T13:21:04+00:00</td>' +
          '<td class="" width="0">hello</td></tr>' +
          '<tr><td class="" width="">2014-07-03T13:19:04+00:00</td>' +
          '<td class="" width="">hello world</td></tr>' +
          '<tr><td class="" width="">2014-07-03T13:23:04+00:00</td>' +
          '<td class="" width="">hello world</td></tr></tbody></table>'
        );
        table = new Table({
          el: $el,
          collection: new Collection([{
            '_timestamp': '2014-07-03T13:21:04+00:00',
            value: 'hello'
          },
          {
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'hello world'
          },
          {
            '_timestamp': '2014-07-03T13:23:04+00:00',
            value: 'hello world'
          }], {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          }),
        });

        table.render();
      });

      it('adds a class of desc if the col isnt sorted', function () {
        var sortByDate = table.$table.find('thead th:first'),
            sortByValue = table.$table.find('thead th:last');

        expect(sortByDate.attr('class')).toEqual(undefined);
        expect(sortByValue.attr('class')).toEqual(undefined);

        sortByDate.find('a').click();

        expect(sortByDate.attr('class')).toEqual('desc');
        expect(sortByValue.attr('class')).toEqual(undefined);
      });

      it('adds a class of asc if the col already desc', function () {
        var sortByDate = table.$table.find('thead th:first'),
            sortByValue = table.$table.find('thead th:last');

        expect(sortByDate.attr('class')).toEqual(undefined);
        expect(sortByValue.attr('class')).toEqual(undefined);

        sortByDate.find('a').click();
        sortByDate.find('a').click();

        expect(sortByDate.attr('class')).toEqual('asc');
        expect(sortByValue.attr('class')).toEqual(undefined);
      });

      it('it removes asc from other cols', function () {
        var sortByDate = table.$table.find('thead th:first'),
            sortByValue = table.$table.find('thead th:last');

        sortByDate.find('a').click();
        sortByDate.find('a').click();

        expect(sortByDate.attr('class')).toEqual('asc');
        expect(sortByValue.attr('class')).toEqual(undefined);

        sortByValue.find('a').click();

        expect(sortByDate.attr('class')).toEqual('');
        expect(sortByValue.attr('class')).toEqual('desc');
      });

      it('it removes desc from other cols', function () {
        var sortByDate = table.$table.find('thead th:first'),
            sortByValue = table.$table.find('thead th:last');

        sortByDate.find('a').click();

        expect(sortByDate.attr('class')).toEqual('desc');
        expect(sortByValue.attr('class')).toEqual(undefined);

        sortByValue.find('a').click();

        expect(sortByDate.attr('class')).toEqual('');
        expect(sortByValue.attr('class')).toEqual('desc');
      });

      it('sorts the tableCollection desc', function () {
        var sortByValue = table.$table.find('thead th:last');

        expect(table.tableCollection.at(0).get('value')).toEqual('hello world');
        expect(table.tableCollection.at(1).get('value')).toEqual('hello');
        expect(table.tableCollection.at(2).get('value')).toEqual('hello world');

        sortByValue.find('a').click();

        expect(table.tableCollection.at(0).get('value')).toEqual('hello world');
        expect(table.tableCollection.at(1).get('value')).toEqual('hello world');
        expect(table.tableCollection.at(2).get('value')).toEqual('hello');
      });

      it('sorts the tableCollection asc', function () {
        var sortByValue = table.$table.find('thead th:last');

        expect(table.tableCollection.at(0).get('value')).toEqual('hello world');
        expect(table.tableCollection.at(1).get('value')).toEqual('hello');
        expect(table.tableCollection.at(2).get('value')).toEqual('hello world');

        sortByValue.find('a').click();
        sortByValue.find('a').click();

        expect(table.tableCollection.at(0).get('value')).toEqual('hello');
        expect(table.tableCollection.at(1).get('value')).toEqual('hello world');
        expect(table.tableCollection.at(2).get('value')).toEqual('hello world');
      });

      it('secondary sorts on the _timestamp attr', function () {
        var sortByValue = table.$table.find('thead th:last');

        expect(table.tableCollection.at(0).get('_timestamp')).toEqual('2014-07-03T13:19:04+00:00');
        expect(table.tableCollection.at(1).get('_timestamp')).toEqual('2014-07-03T13:21:04+00:00');
        expect(table.tableCollection.at(2).get('_timestamp')).toEqual('2014-07-03T13:23:04+00:00');

        sortByValue.find('a').click();

        expect(table.tableCollection.at(0).get('_timestamp')).toEqual('2014-07-03T13:19:04+00:00');
        expect(table.tableCollection.at(1).get('_timestamp')).toEqual('2014-07-03T13:23:04+00:00');
        expect(table.tableCollection.at(2).get('_timestamp')).toEqual('2014-07-03T13:21:04+00:00');
      });

      it('doesnt sort the main collection', function () {
        var sortByValue = table.$table.find('thead th:last');

        sortByValue.find('a').click();

        expect(table.tableCollection.at(0).get('_timestamp')).toEqual('2014-07-03T13:19:04+00:00');
        expect(table.tableCollection.at(1).get('_timestamp')).toEqual('2014-07-03T13:23:04+00:00');
        expect(table.tableCollection.at(2).get('_timestamp')).toEqual('2014-07-03T13:21:04+00:00');

        expect(table.collection.at(0).get('_timestamp')).toEqual('2014-07-03T13:19:04+00:00');
        expect(table.collection.at(1).get('_timestamp')).toEqual('2014-07-03T13:21:04+00:00');
        expect(table.collection.at(2).get('_timestamp')).toEqual('2014-07-03T13:23:04+00:00');
      });
    });

    describe('render', function () {
      var table;

      beforeEach(function () {
        table = new Table({
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'hello world'
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          }),
        });
      });

      it('adds a class of touch-table on touch devices', function () {
        var isTouch = Modernizr.touch;
        var touchTable = new Table({
          collection: new Collection({
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          })
        }),
        $table = $('<table></table>');

        Modernizr.touch = true;
        touchTable.$el.append($table);
        touchTable.$table = $table;
        touchTable.render();
        expect($table.attr('class')).toContain('touch-table');
        Modernizr.touch = isTouch;
      });

      it('adds a class of floated-header to the table element on the client-side when table body has more cells than the header', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>Item1</td><td>Item2</td></tr><tr><td>Item1</td><td>Item2</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.$table = $table;
        table.render();

        expect($table.attr('class')).toContain('floated-header');
      });

      it('doesnt a class of floated-header to the table element on the client-side when the table body has "no data"', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>No data available</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.$table = $table;
        table.render();

        expect($table.attr('class')).toNotEqual('floated-header');
      });

      it('renders links in the thead', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>No data available</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.$table = $table;

        expect($table.find('thead a').length).toEqual(0);

        table.render();

        expect($table.find('thead a').length).toEqual(2);
      });
    });

  });
});
