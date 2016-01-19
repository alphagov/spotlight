define([
  'extensions/views/table',
  'extensions/views/view',
  'extensions/collections/collection',
    'backbone',
  'jquery'
],
function (Table, View, Collection, Backbone, $) {
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
        spyOn(Collection.prototype, 'getPeriod').andReturn('month');
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

      it('does not render if it has been removed', function () {
        table.remove();
        table.collection.trigger('reset');
        expect(table.render).not.toHaveBeenCalled();
      });

      it('sets collection period to own period property', function () {
        expect(table.collection.getPeriod).toHaveBeenCalled();
        expect(table.period).toEqual('month');
      });

    });

    describe('render', function () {
      var table,
        tableOptions;

      beforeEach(function () {
        spyOn(Table.prototype, 'prepareTable').andCallThrough();
        var collection,
          Collection;

        Collection = Backbone.Collection.extend({
          on: jasmine.createSpy(),
          options: {
            axes: {
              x: {
                label: 'date',
                key: 'timestamp'
              },
              y: [
                { label: 'another', key: 'value' },
                { label: 'onemore', key: 'value', timeshift: 52 },
                { label: 'last', key: 'number_of_transactions' }
              ]
            }
          },
          getTableRows: function () {},
          sortByAttr: function () {},
          getPeriod: function () { return 'week'; }
        });
        collection = new Collection([]);
        tableOptions = {
          model: new Backbone.Model({
            'sort-by': 'number_of_transactions',
            'sort-order': 'descending'
          }),
          collection: collection,
          valueAttr: 'value'
        };
        spyOn(collection, 'getTableRows').andReturn([
          ['dept', '01/02/01', 'foo', 10, null],
          ['agency', '04/03/12', 'bar', 5, null]
        ]);
      });

      it('renders no data if there are no rows', function () {
        table = new Table(tableOptions);
        table.collection.getTableRows.andReturn([]);
        table.render();

        expect(table.$el.find('tbody tr').length).toBe(1);
        expect(table.$el.find('tbody td').length).toBe(1);
        expect(table.$el.find('tbody td').text()).toEqual('No data available');
      });

      it('empties the table if $table exists and removes class', function () {
        table = new Table(tableOptions);
        spyOn(table, 'renderHead');
        spyOn(table, 'renderBody');
        table.$table = $('<table><tbody><tr><td>test table value</td></tr></tbody></table>');
        table.$table.addClass('floated-header');

        table.render();

        expect(table.$table.html()).toEqual('');
        expect(table.$table.hasClass('floated-header')).toBe(false);
      });

      it('calls prepareTable if table property is not set', function () {
        table = new Table(tableOptions);
        table.render();
        expect(Table.prototype.prepareTable).toHaveBeenCalled();
      });

      it('hides the table header if config option set', function () {
        tableOptions.hideHeader = true;
        table = new Table(tableOptions);
        table.render();
        expect(table.$el.find('thead').hasClass('visuallyhidden')).toEqual(true);
      });

      it('will render with "no data" when a row has null values', function () {
        table = new Table(tableOptions);
        table.render();
        expect(table.$el.find('tbody tr').eq(0).find('td').eq(4).text())
          .toEqual('');
      });

      it('will call collection.getTableRows with the column keys', function () {
        table = new Table(tableOptions);
        table.render();
        expect(table.collection.getTableRows)
          .toHaveBeenCalledWith(['department_name', 'timestamp', 'value', 'timeshift52:value', 'number_of_transactions'] , undefined);
      });

      it('does not crash if no data is provided', function () {
        table = new Table(tableOptions);
        table.collection.getTableRows.andReturn([[]]);
        expect(_.bind(table.render, table)).not.toThrow();
      });

      it('will append the timeshift duration to the column header', function () {
        table = new Table(tableOptions);
        table.render();
        expect(table.$el.find('thead th').eq(3).text())
          .toEqual('onemore (52 weeks ago) Click to sort');
      });

      describe('getColumns', function () {
        it('returns an array of consolidated axes data', function () {
          table = new Table(tableOptions);
          expect(table.getColumns()).toEqual([
              { key: 'department_name', label: 'Department', format: 'sentence'},
              { key: 'timestamp', label: 'date' },
              { key: 'value', label: 'another' },
              { key: 'timeshift52:value', label: 'onemore', timeshift: 52 },
              { key: 'number_of_transactions', label: 'last' }
            ]);
        });
      });

      it('formats cell content if a formatter is defined', function () {
        table = new Table(tableOptions);
        spyOn(table, 'format').andReturn('10%');
        table.collection.options.axes.y[1].format = 'percent';
        table.render();
        expect(table.format).toHaveBeenCalledWith(10, 'percent');
        expect(table.$el.find('tbody tr').eq(0).find('th,td').eq(3).text())
          .toEqual('10%');
      });

      it('it adds a class if a formatter is defined', function () {
        table = new Table(tableOptions);
        spyOn(table, 'format').andReturn('10');
        table.collection.options.axes.y[1].format = 'integer';
        table.render();
        expect(table.format).toHaveBeenCalledWith(10, 'integer');
        expect(table.$el.find('tbody tr').eq(0).find('th,td').eq(3).hasClass('integer'))
          .toBe(true);
      });

      it('it doesnt add a class if no formatter', function () {
        table = new Table(tableOptions);
        table.render();
        expect(table.$el.find('tbody tr').eq(0).find('th,td').eq(2).attr('class'))
          .toBeFalsy();
      });

      it('adds column keys as data attrs to header cells', function () {
        table = new Table(tableOptions);
        table.render();
        expect(table.$('th:eq(0)').attr('data-key')).toEqual('department_name');
        expect(table.$('th:eq(1)').attr('data-key')).toEqual('timestamp');
        expect(table.$('th:eq(2)').attr('data-key')).toEqual('value');
        expect(table.$('th:eq(3)').attr('data-key')).toEqual('timeshift52:value');
        expect(table.$('th:eq(4)').attr('data-key')).toEqual('number_of_transactions');
      });

      it('adds first key as data attrs to header cell if key is an array', function () {
        table = new Table(tableOptions);
        table.collection.options.axes.x.key = ['start', 'end'];
        table.render();
        expect(table.$('th:eq(0)').attr('data-key')).toEqual('department_name');
      });

      it('adds the row index as an attribute to the first cell in a row', function () {
        table = new Table(tableOptions);
        table.render();
        expect(table.$('tbody tr:eq(0) th:eq(0)').attr('data-title')).toEqual('1');
        expect(table.$('tbody tr:eq(1) th:eq(0)').attr('data-title')).toEqual('2');
      });

      it('marks the "transactions per year" column as sorted (descending)' +
        ' if no sort is specified in the URL', function() {
        table = new Table(tableOptions);
        table.render();
        expect(table.$('thead th.descending').attr('data-key')).toEqual('number_of_transactions');
      });

      it('adds a link to non-default columns to sort by descending', function() {
        table = new Table(tableOptions);
        table.render();
        expect(table.$('thead th[data-key="timestamp"] a').attr('href'))
          .toEqual('?sortby=timestamp&sortorder=descending');
      });

      it('adds a link to the default column to sort by ascending', function() {
        table = new Table(tableOptions);
        table.render();
        expect(table.$('thead th.descending a').attr('href'))
          .toEqual('?sortby=number_of_transactions&sortorder=ascending');
      });

      it('adds a link to sort by ascending to the default column if it changes', function() {
        table = new Table(tableOptions);
        table.model.set('sort-by', 'timestamp');
        table.render();
        expect(table.$('thead th[data-key="timestamp"] a').attr('href'))
          .toEqual('?sortby=timestamp&sortorder=ascending');
      });

      it('marks each cell in the sorted column', function() {
        var result = true;
        table = new Table(tableOptions);
        table.render();
        table.$('[data-key="number_of_transactions"]').each(function() {
          if (!$(this).hasClass('sort-column')) {
            result = false;
          }
        });
        expect(result).toEqual(true);
      });

      it('adds a click to sort label for screenreaders to all columns except the sorted one',
        function() {
          var unsortedCols;

          table = new Table(tableOptions);
          table.render();
          unsortedCols = table.$('thead th:not(.sort-column) .js-click-sort');
          expect(unsortedCols.length).toEqual(4);
          expect(unsortedCols.first().text()).toEqual('Click to sort');
          expect(table.$('thead th.sort-column .js-click-sort').length).toEqual(0);
      });

    });

    describe('sort', function() {
      var table;

      beforeEach(function () {
        spyOn(Table.prototype, 'prepareTable').andCallThrough();
        table = new Table({
          model: new Backbone.Model({
            'sort-by': 'number_of_transactions',
            'sort-order': 'descending',
            params: {
              sortby: 'title'
            }
          }),
          collection: new Collection([
              {
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
              }
            ],
            {
              axes: {
                x: {label: 'date', key: 'timestamp'},
                y: [{label: 'another', key: 'value'}]
              }
            })
        });
      });

      it('overrides default sort if a sort order has been stored in the URL', function() {
        expect(table.model.get('sort-by')).toEqual('title');
        expect(table.model.get('sort-order')).toEqual('descending');
      });

      it('sorts the tableCollection desc', function () {

        expect(table.collection.at(0).get('value')).toEqual('hello');
        expect(table.collection.at(1).get('value')).toEqual('hello world');
        expect(table.collection.at(2).get('value')).toEqual('hello world');

        table.model.set('sort-by', 'value');

        expect(table.collection.at(0).get('value')).toEqual('hello world');
        expect(table.collection.at(1).get('value')).toEqual('hello world');
        expect(table.collection.at(2).get('value')).toEqual('hello');
      });

      it('sorts the tableCollection asc', function () {

        expect(table.collection.at(0).get('value')).toEqual('hello');
        expect(table.collection.at(1).get('value')).toEqual('hello world');
        expect(table.collection.at(2).get('value')).toEqual('hello world');


        table.model.set('sort-by', 'value');
        table.model.set('sort-order', 'ascending');

        expect(table.collection.at(0).get('value')).toEqual('hello');
        expect(table.collection.at(1).get('value')).toEqual('hello world');
        expect(table.collection.at(2).get('value')).toEqual('hello world');
      });

      it('secondary sorts on the _timestamp attr', function () {

        expect(table.collection.at(0).get('_timestamp')).toEqual('2014-07-03T13:21:04+00:00');
        expect(table.collection.at(1).get('_timestamp')).toEqual('2014-07-03T13:19:04+00:00');
        expect(table.collection.at(2).get('_timestamp')).toEqual('2014-07-03T13:23:04+00:00');

        table.model.set('sort-by', 'value');

        expect(table.collection.at(0).get('_timestamp')).toEqual('2014-07-03T13:19:04+00:00');
        expect(table.collection.at(1).get('_timestamp')).toEqual('2014-07-03T13:23:04+00:00');
        expect(table.collection.at(2).get('_timestamp')).toEqual('2014-07-03T13:21:04+00:00');
      });

      it('sorts links by the link text only', function () {

        table.collection.reset([
          {
            '_timestamp': '2014-07-03T13:21:04+00:00',
            value: '<a href="c">hello a</a>'
          },
          {
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: '<a href="a">hello b</a>'
          },
          {
            '_timestamp': '2014-07-03T13:23:04+00:00',
            value: '<a href="b">hello c</a>'
          }
        ]);

        table.model.set('sort-by', 'value');

        expect(table.collection.at(0).get('value')).toEqual('<a href="b">hello c</a>');
        expect(table.collection.at(1).get('value')).toEqual('<a href="a">hello b</a>');
        expect(table.collection.at(2).get('value')).toEqual('<a href="c">hello a</a>');
      });

      it('puts blank values last when sorting descending', function() {
        table.collection.unshift({
          '_timestamp': '2014-07-03T13:21:04+00:00',
          value: null
        });
        table.collection.trigger('reset');
        table.render();

        table.model.set('sort-by', 'value');
        expect(table.collection.at(3).get('value')).toBeNull();
      });

      it('puts blank values last when sorting ascending', function() {
        table.collection.unshift({
          '_timestamp': '2014-07-03T13:21:04+00:00',
          value: null
        });
        table.collection.trigger('reset');
        table.render();

        table.model.set('sort-by', 'value');
        table.model.set('sort-order', 'ascending');

        expect(table.collection.at(3).get('value')).toBeNull();
      });


    });
  });
});
