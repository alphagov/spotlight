define([
  'extensions/views/table',
  'extensions/views/view'
],
function (Table, View) {
  describe('Table', function () {
    it('inherits from View', function () {
      var table = new Table({
          collection: {
            on: jasmine.createSpy()
          }
        });

      expect(table instanceof View).toBe(true);
    });

    describe('initialize', function () {
      var table;
      beforeEach(function () {
        spyOn(Table.prototype, 'prepareTable');
        table = new Table({
          collection: {
            on: jasmine.createSpy()
          }
        });
      });

      it('calls prepareTable', function () {
        expect(Table.prototype.prepareTable).toHaveBeenCalled();
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
              return [['date', 'another', 'last'], ['01/02/01', 'foo', 'bar']];
            }
          }
        });
      });

      it('calls renderEl', function () {
        expect(Table.prototype.renderEl).not.toHaveBeenCalled();

        table.render();

        expect(Table.prototype.renderEl).toHaveBeenCalled();
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

        it('renders attributs', function () {
          var context = $('<tr>');
          table.renderEl('th', context, 'test heading', {scope: 'col'});

          expect(context.html()).toBe('<th scope="col">test heading</th>');
        });
      });

      it('renders a table', function () {
        table.render();

        expect(table.table.html())
          .toBe('<tbody><tr><th scope="col">date</th><td>another</td><td>last</td></tr><tr><th scope="col">01/02/01</th><td>foo</td><td>bar</td></tr></tbody>');
      });
    });
  });
});
