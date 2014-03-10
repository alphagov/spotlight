define([
  'extensions/views/table',
  'extensions/views/view',
  'jquery'
],
function (Table, View, $) {
  describe('Table', function () {
    it('inherits from View', function () {
      var table = new Table({
          collection: {
            on: jasmine.createSpy(),
            options: {
              axes: {}
            }
          }
        });

      expect(table instanceof View).toBe(true);
    });

    describe('initialize', function () {
      var table;
      beforeEach(function () {
        table = new Table({
          collection: {
            on: jasmine.createSpy(),
            options: { axes: {} }
          }
        });
      });

    });

    describe('render', function () {
      var table;
      beforeEach(function () {
        spyOn(Table.prototype, 'prepareTable').andCallThrough();
        spyOn(Table.prototype, 'renderEl').andCallThrough();
        table = new Table({
          collection: {
            on: jasmine.createSpy(),
            options: { axes: {
              x: {
                label: 'date',
                key: 'timestamp'
              },
              y: [
                { label: 'another' },
                { label: 'last' }
              ]
            } },
            getTableRows: function () {}
          },
          valueAttr: 'value'
        });
        spyOn(table.collection, 'getTableRows').andReturn([['01/02/01', 'foo', null]]);
      });

      it('calls prepareTable if table property is not set', function () {
        table.render();
        expect(Table.prototype.prepareTable).toHaveBeenCalled();
      });

      it('does not call prepareTable if it has previously been called', function () {
        table.prepareTable();
        Table.prototype.prepareTable.reset();
        table.render();
        expect(Table.prototype.prepareTable).not.toHaveBeenCalled();
      });

      it('will call renderEl with "no data" when a row has null values', function () {
        table.render();
        expect(Table.prototype.renderEl.mostRecentCall.args[2]).toEqual('no data');
      });

      it('will call collection.getTableRows with the column keys', function () {
        table.render();
        expect(table.collection.getTableRows).toHaveBeenCalledWith(['timestamp', 'value', 'value']);
      });

      describe('renderEl', function () {
        it('does nothing with no context', function () {
          expect(table.renderEl('tr')).toBe(undefined);
        });

        it('renders empty elements', function () {
          var context = $('<tr>');
          table.renderEl('td', context);

          expect(context.html()).toBe('<td></td>');
        });

        it('renders elements with values', function () {
          var context = $('<tr>');
          table.renderEl('th', context, 'test heading');

          expect(context.html()).toBe('<th>test heading</th>');
        });

        it('renders elements with falsy values', function () {
          var context = $('<tr>');
          table.renderEl('th', context, 0);

          expect(context.html()).toBe('<th>0</th>');
        });

        it('renders attributes', function () {
          var context = $('<tr>');
          table.renderEl('th', context, 'test heading', {scope: 'col'});

          expect(context.html()).toBe('<th scope="col">test heading</th>');
        });
      });

      describe('getColumns', function () {
        it('returns an array of consolidated axes data', function () {
          expect(table.getColumns()).toEqual([
              { key: 'timestamp', label: 'date' },
              { key: 'value', label: 'another' },
              { key: 'value', label: 'last' }
            ]);
        });
        it('filters columns based on y-axis keys', function () {
          table.collection.options.axes.y[1].key = 'differentKey';
          expect(table.getColumns()).toEqual([
              { key: 'timestamp', label: 'date' },
              { key: 'value', label: 'another' }
            ]);
        });
      });

      describe('renderCell', function () {
        it('formats cell content if a formatter is defined', function () {
          spyOn(table, 'format').andReturn('10%');
          table.renderCell('td', null, 10, { format: 'percent' });
          expect(table.format).toHaveBeenCalledWith(10, 'percent');
          expect(table.renderEl).toHaveBeenCalledWith('td', null, '10%');
        });
      });

      it('renders a table', function () {
        table.render();
        expect(table.$table.html())
          .toBe('<thead>' +
                  '<tr><th scope="col">date</th><th scope="col">another</th><th scope="col">last</th></tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr><td>01/02/01</td><td>foo</td><td>no data</td></tr>' +
                '</tbody>');
      });

    });
  });
});
