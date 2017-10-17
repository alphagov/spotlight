define([
  'client/views/table',
  'extensions/views/table',
  'extensions/collections/collection',
  'extensions/models/model',
  'jquery',
  'modernizr'
],
function (Table, BaseTable, Collection, Model, $, Modernizr) {
  describe('Table', function () {
    describe('initialize', function () {
      var table,
        options;

      beforeEach(function () {
        spyOn(Table.prototype, 'render');
        spyOn(BaseTable.prototype, 'initialize');
        options = {
          model: new Model(),
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'hello world',
            options: {
              axes: {
                x: { label: 'date', key: 'timestamp' },
                y: [{ label: 'another', key: 'value' }]
              }
            }
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          })
        };
      });

      it('listens to sort on the collection', function () {
        table = new Table(options);
        table.collection.trigger('sort');
        expect(table.render).toHaveBeenCalled();
      });

      it('calls initialize on TableView', function () {
        table = new Table(options);
        expect(BaseTable.prototype.initialize).toHaveBeenCalled();
      });

      it('uses an X axis if supplied', function () {
        table = new Table(options);
        expect(table.sortFields.timestamp.label).toEqual('date');
      });

      it('doesnt try to use an X axis if one isnt supplied', function () {
        delete options.collection.options.axes.x;
        table = new Table(options);
        expect(table.sortFields.timestamp).toBeUndefined();
      });

    });

    describe('renderSort', function () {
      var table;
      beforeEach(function () {
        spyOn(BaseTable.prototype, 'renderBody');
        spyOn(Table.prototype, 'render');
        table = new Table({
          model: new Model(),
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'model 1'
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          })
        });
      });

      it('calls render', function () {

        expect(table.render).not.toHaveBeenCalled();

        table.render();

        expect(table.render).toHaveBeenCalled();

      });
    });

    describe('sort', function () {
      var table;

      beforeEach(function () {
        // clear window.location.search
        window.history.replaceState({}, '', window.location.href.split('?')[0]);
        var $el = $('<div/>');
        $el.html(
          '<table><thead><tr><th scope="col" width="0" data-key="_timestamp">' +
          '<a class="js-sort" href="#" role="button">date</a></th>' +
          '<th scope="col" width="0" data-key="value"><a class="js-sort" href="#" role="button">another</a></th></tr></thead><tbody><tr><td class="" width="0">2014-07-03T13:21:04+00:00</td>' +
          '<td class="" width="0">hello</td></tr>' +
          '<tr><td class="" width="">2014-07-03T13:19:04+00:00</td>' +
          '<td class="" width="">hello world</td></tr>' +
          '<tr><td class="" width="">2014-07-03T13:23:04+00:00</td>' +
          '<td class="" width="">hello world</td></tr></tbody></table>'
        );
        window.GOVUK = {
          analytics: {
            trackEvent: function () {}
          }
        };
        table = new Table({
          el: $el,
          model: new Model(),
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
          saveSortInUrl: true,
          analytics: {
            category: 'ppServices'
          }
        });

        table.render();
      });

      function dateColumn() {
        return table.$('thead th:first');
      }

      function valueColumn() {
        return table.$('thead th:last');
      }

      it('adds a class of desc if the col isnt sorted', function () {
        expect(dateColumn().attr('class')).toEqual(undefined);
        expect(valueColumn().attr('class')).toEqual(undefined);

        dateColumn().find('a').click();

        expect(dateColumn().hasClass('descending')).toEqual(true);
        expect(valueColumn().hasClass('descending')).toEqual(false);
      });

      it('adds a class of ascending if the col already descending', function () {
        expect(dateColumn().attr('class')).toEqual(undefined);
        expect(valueColumn().attr('class')).toEqual(undefined);

        dateColumn().find('a').click();
        dateColumn().find('a').click();

        expect(dateColumn().hasClass('ascending')).toEqual(true);
        expect(valueColumn().hasClass('ascending')).toEqual(false);
      });

      it('it removes asc from other cols', function () {
        dateColumn().find('a').click();
        dateColumn().find('a').click();

        expect(dateColumn().hasClass('ascending')).toEqual(true);
        expect(valueColumn().hasClass('ascending')).toEqual(false);

        valueColumn().find('a').click();

        expect(dateColumn().hasClass('descending')).toEqual(false);
        expect(valueColumn().hasClass('descending')).toEqual(true);
      });

      it('it removes desc from other cols', function () {
        dateColumn().find('a').click();

        expect(dateColumn().hasClass('descending')).toEqual(true);
        expect(valueColumn().hasClass('descending')).toEqual(false);

        valueColumn().find('a').click();

        expect(dateColumn().hasClass('descending')).toEqual(false);
        expect(valueColumn().hasClass('descending')).toEqual(true);
      });

      it('stores the sort column and order in the browser address if option set', function() {
        var sortByValue = table.$('thead th:last');
        spyOn(Table.prototype, 'replaceUrlParams');
        sortByValue.find('a').click();
        expect(Table.prototype.replaceUrlParams.calls.first().args[0]).toEqual('sortby=value&sortorder=descending');
      });

      it('doesnt store the sort column and order in the browser address if option not set',
        function() {
        var sortByValue = table.$('thead th:last');
        table.options.saveSortInUrl = false;
        spyOn(Table.prototype, 'replaceUrlParams');
        sortByValue.find('a').click();
        expect(Table.prototype.replaceUrlParams.calls.count()).toEqual(0);
      });

      it('adds a click to sort label for screenreaders to all columns except the sorted one',
        function() {
          dateColumn().find('a').click();
          expect(dateColumn().find('.js-click-sort').length).toEqual(0);
          expect(valueColumn().find('.js-click-sort').length).toEqual(1);
          valueColumn().find('a').click();
          expect(valueColumn().find('.js-click-sort').length).toEqual(0);
          expect(dateColumn().find('.js-click-sort').length).toEqual(1);
        });

      it('sends sort events to analytics', function() {

        spyOn(window.GOVUK.analytics, 'trackEvent');
        dateColumn().find('a').click();
        expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'sort', {
          label: '_timestamp',
          value: 1,
          nonInteraction: true
        });
        valueColumn().find('a').click();
        expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'sort', {
          label: 'value',
          value: 1,
          nonInteraction: true
        });
        valueColumn().find('a').click();
        expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'sort', {
          label: 'value',
          value: 0,
          nonInteraction: true
        });
      });

    });

    describe('render', function () {
      var table;

      beforeEach(function () {
        spyOn(BaseTable.prototype, 'render');
        table = new Table({
          model: new Model(),
          collection: new Collection({
            '_timestamp': '2014-07-03T13:19:04+00:00',
            value: 'hello world'
          }, {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          })
        });
      });

      it('adds a class of touch-table on touch devices', function () {
        var isTouch = Modernizr.touch;
        var touchTable = new Table({
          model: new Model(),
          collection: new Collection([], {
            axes: {
              x: { label: 'date', key: 'timestamp' },
              y: [{ label: 'another', key: 'value' }]
            }
          })
        }),
        $table = $('<table></table>');

        Modernizr.touch = true;
        touchTable.$el.append($table);
        touchTable.render();
        expect($table.attr('class')).toContain('touch-table');
        Modernizr.touch = isTouch;
      });

      it('adds a class of floated-header to the table element on the client-side when table body has more cells than the header', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>Item1</td><td>Item2</td></tr><tr><td>Item1</td><td>Item2</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.collection.push({
          '_timestamp': '2014-07-03T13:19:04+00:00',
          value: 'row 2'
        });
        table.render();

        expect($table.attr('class')).toContain('floated-header');
      });

      it('doesnt a class of floated-header to the table element on the client-side when the table body has "no data"', function () {
        var tableHeader = '<thead><tr><th>Col1</th><th>Col2</th></tr></thead>',
            tableBody = '<tbody><tr><td>No data available</td></tr></tbody>';

        var $table = $('<table>' + tableHeader + tableBody + '</table>');
        table.$el.append($table);
        table.render();

        expect($table.attr('class')).not.toEqual('floated-header');
      });

    });

  });
});
