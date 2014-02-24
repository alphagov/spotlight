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
            getDataByTableFormat: jasmine.createSpy()
          }
        });

      expect(table instanceof View).toBe(true);
    });

    describe('initialize', function () {
      var table;
      beforeEach(function () {
        spyOn(Table.prototype, 'render');
        spyOn(Table.prototype, 'prepareTable');
        table = new Table({
          collection: {
            on: jasmine.createSpy(),
            getDataByTableFormat: function () {}
          }
        });
      });

      it('calls prepareTable', function () {
        expect(Table.prototype.prepareTable).toHaveBeenCalled();
      });

      it('calls render', function () {
        expect(Table.prototype.render).toHaveBeenCalled();
      });
    });

    describe('render', function () {
      var table;
      beforeEach(function () {
        spyOn(Table.prototype, 'renderEl').andCallThrough();
        table = new Table({
          collection: {
            on: jasmine.createSpy(),
            getDataByTableFormat: function () {
              return [['date', 'another', 'last'], ['01/02/01', 'foo', null]];
            }
          }
        });
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

        it('renders attributs', function () {
          var context = $('<tr>');
          table.renderEl('th', context, 'test heading', {scope: 'col'});

          expect(context.html()).toBe('<th scope="col">test heading</th>');
        });
      });

      it('renders a table', function () {
        table.render();

        expect(table.table.html())
          .toBe('<tbody><tr><th scope="col">date</th><th scope="col">another</th><th scope="col">last</th></tr><tr><td>01/02/01</td><td>foo</td><td>no data</td></tr></tbody>');
      });
    });
  });
});
