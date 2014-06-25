define([
  'client/views/table',
  'jquery'
],
function (Table, $) {
  describe('Table', function () {


    describe('render', function () {

      var table;

      beforeEach(function () {
        table = new Table({
          collection: {
            on: jasmine.createSpy(),
            options: { axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            } }
          },
          valueAttr: 'value'
        });
      });

      it('adds a class of touch-table on touch devices', function () {
        var touchTable = new Table({
          collection: {
            on: jasmine.createSpy(),
            options: { axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            } }
          },
          valueAttr: 'value'
        }, { touch: true });
        var $table = $('<table></table>');
        touchTable.$el.append($table);
        touchTable.render();
        expect($table.attr('class')).toContain('touch-table');
      });

      it('adds a class of floated-header to the table element on the client-side when table body has more cells than the header', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>Item1</td><td>Item2</td></tr><tr><td>Item1</td><td>Item2</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.render();

        expect($table.attr('class')).toContain('floated-header');
      });

      it('doesnt a class of floated-header to the table element on the client-side when the table body has "no data"', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>No data available</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.render();

        expect($table.attr('class')).toNotEqual('floated-header');
      });
    });

  });
});
