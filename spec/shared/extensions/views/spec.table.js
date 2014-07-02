define([
  'extensions/views/table',
  'extensions/views/view',
  'extensions/collections/collection',
  'jquery'
],
function (Table, View, Collection, $) {
  describe('Table', function () {
    it('inherits from View', function () {
      var table = new Table({
          collection: new Collection()
        });

      expect(table instanceof View).toBe(true);
    });

    describe('initialize', function () {
      var table;
      beforeEach(function () {
        spyOn(Table.prototype, 'render');
        table = new Table({
          collection: new Collection()
        });
      });

      it('renders on collection reset', function () {
        table.collection.trigger('reset');
        expect(table.render).toHaveBeenCalled();
      });

      it('renders on collection add', function () {
        table.collection.trigger('add');
        expect(table.render).toHaveBeenCalled();
      });

      it('renders on collection remove', function () {
        table.collection.trigger('remove');
        expect(table.render).toHaveBeenCalled();
      });

      it('renders on collection sync', function () {
        table.collection.trigger('sync');
        expect(table.render).toHaveBeenCalled();
      });

      it('does not render if it has been removed', function () {
        table.remove();
        table.collection.trigger('reset');
        expect(table.render).not.toHaveBeenCalled();
      });

    });

    describe('render', function () {
      var table;

      beforeEach(function () {
        spyOn(Table.prototype, 'prepareTable').andCallThrough();
        table = new Table({
          collection: {
            on: jasmine.createSpy(),
            options: {
              period: 'week',
              axes: {
                x: {
                  label: 'date',
                  key: 'timestamp'
                },
                y: [
                  { label: 'another', key: 'value' },
                  { label: 'onemore', key: 'value', timeshift: 52 },
                  { label: 'last', key: 'value' }
                ]
              }
            },
            getTableRows: function () {},
            sortByAttr: function () {}
          },
          valueAttr: 'value'
        });
        spyOn(table.collection, 'getTableRows').andReturn([['01/02/01', 'foo', 10, null]]);
      });

      it('renders no data if there are no rows', function () {
        table.collection.getTableRows.andReturn([]);
        table.render();

        expect(table.$el.find('tbody tr').length).toBe(1);
        expect(table.$el.find('tbody td').length).toBe(1);
        expect(table.$el.find('tbody td').text()).toEqual('No data available');
      });

      it('empties the table if $table exists and removes class', function () {
        spyOn(table, 'renderHead');
        spyOn(table, 'renderBody');
        table.$table = $('<table><tr><td>test table value</td></tr></table>');
        table.$table.addClass('floated-header');

        table.render();

        expect(table.$table.html()).toEqual('');
        expect(table.$table.hasClass('floated-header')).toBe(false);
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

      it('will render with "no data" when a row has null values', function () {
        table.render();
        expect(table.$el.find('tbody tr').eq(0).find('td').eq(3).text())
          .toEqual('no data');
      });

      it('will call collection.getTableRows with the column keys', function () {
        table.render();
        expect(table.collection.getTableRows)
          .toHaveBeenCalledWith(['timestamp', 'value', 'value', 'value']);
      });

      it('does not crash if no data is provided', function () {
        table.collection.getTableRows.andReturn([[]]);
        expect(_.bind(table.render, table)).not.toThrow();
      });

      it('will append the timeshift duration to the column header', function () {
        table.render();
        expect(table.$el.find('thead th').eq(2).text())
          .toEqual('onemore (52 weeks ago)');
      });

      describe('getColumns', function () {
        it('returns an array of consolidated axes data', function () {
          expect(table.getColumns()).toEqual([
              { key: 'timestamp', label: 'date' },
              { key: 'value', label: 'another' },
              { key: 'value', label: 'onemore', timeshift: 52 },
              { key: 'value', label: 'last' }
            ]);
        });
      });

      it('formats cell content if a formatter is defined', function () {
        spyOn(table, 'format').andReturn('10%');
        table.collection.options.axes.y[1].format = 'percent';
        table.render();
        expect(table.format).toHaveBeenCalledWith(10, 'percent');
        expect(table.$el.find('tbody tr').eq(0).find('td').eq(2).text())
          .toEqual('10%');
      });

      it('it adds a class if a formatter is defined', function () {
        spyOn(table, 'format').andReturn('10');
        table.collection.options.axes.y[1].format = 'integer';
        table.render();
        expect(table.format).toHaveBeenCalledWith(10, 'integer');
        expect(table.$el.find('tbody tr').eq(0).find('td').eq(2).hasClass('integer'))
          .toBe(true);
      });

      it('it doesnt add a class if no formater', function () {
        table.render();
        expect(table.$el.find('tbody tr').eq(0).find('td').eq(2).attr('class'))
          .toEqual('');
      });

      it('sorts table rows', function () {
        spyOn(table.collection, 'sortByAttr');
        table.sortBy = 'value';
        table.sortOrder = 'descending';
        table.render();
        expect(table.collection.sortByAttr).toHaveBeenCalledWith('value', true);

        table.collection.sortByAttr.reset();

        table.sortBy = 'timestamp';
        table.sortOrder = 'ascending';
        table.render();
        expect(table.collection.sortByAttr).toHaveBeenCalledWith('timestamp', false);
      });

    });

  });
});
