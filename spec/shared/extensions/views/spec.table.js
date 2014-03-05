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
                label: 'date'
              },
              y: [
                { label: 'another' },
                { label: 'last' }
              ]
            } },
            getTableRows: function () {
              return [['01/02/01', 'foo', null]];
            }
          }
        });
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

      describe('formatValueForTable', function () {
        it('formats the value for uptimeFraction', function () {
          table.valueAttr = 'uptimeFraction';
          expect(table.formatValueForTable(0.2)).toEqual('20%');
        });

        it('formats the value for completion', function () {
          table.valueAttr = 'completion';
          expect(table.formatValueForTable(0.2)).toEqual('20%');
        });

        it('formats the value for avgresponse', function () {
          table.valueAttr = 'avgresponse';
          expect(table.formatValueForTable(2100)).toEqual('2.1s');
        });

        it('doesnt format when valueAttr is undefined', function () {
          table.valueAttr = undefined;
          expect(table.formatValueForTable(2100)).toEqual(2100);
        });

        it('doesnt format when valueAttr is not a number', function () {
          table.valueAttr = 'avgresponse';
          expect(table.formatValueForTable('2100')).toEqual('2100');
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
