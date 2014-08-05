define([
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/models/data_source',
  'backbone',
  'moment-timezone'
],
function (Collection, Model, DataSource, Backbone, moment) {
  describe('Collection', function () {

    it('inherits from Backbone.Collection', function () {
      var collection = new Collection();
      expect(collection instanceof Backbone.Collection).toBe(true);
    });

    it('sets the extended Model as default model', function () {
      var collection = new Collection([{foo: 'bar'}]);
      expect(collection.models[0] instanceof Model).toBe(true);
    });

    describe('prop', function () {
      it('retrieves an object property', function () {
        var collection = new Collection();
        collection.testProp = { foo: 'bar' };
        expect(collection.prop('testProp')).toEqual({ foo: 'bar' });
      });

      it('retrieves an object method result', function () {
        var collection = new Collection();
        collection.otherProp = { foo: 'bar' };
        collection.testProp = function () {
          return this.otherProp;
        };
        expect(collection.prop('testProp')).toEqual({ foo: 'bar' });
      });

      it('retrieves property from another object', function () {
        var collection = new Collection();
        var anotherObject = {
          testProp: { foo: 'bar' }
        };
        expect(collection.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });

      it('retrieves method result from another object', function () {
        var collection = new Collection();
        var anotherObject = {
          otherProp: { foo: 'bar' },
          testProp: function () {
            return this.otherProp;
          }
        };
        expect(collection.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });
    });

    it('retrieves data by default', function () {
      spyOn(Collection.prototype, 'sync');
      var collection = new Collection();
      collection.fetch();
      expect(Collection.prototype.sync).toHaveBeenCalled();
    });

    describe('url', function () {

      var TestCollection;
      beforeEach(function () {
        TestCollection = Collection.extend({
          backdropUrl: '//testdomain/{{ data-group }}/foo/{{ data-type }}',
          'data-group': 'service',
          'data-type': 'apiname'
        });
      });

      it('constructs a backdrop query URL without params', function () {
        var collection = new Collection([], {
          dataSource: {
            'data-group': 'foo',
            'data-type': 'bar'
          }
        });
        collection.dataSource.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
        expect(collection.url()).toEqual('//testdomain/foo/bar');
      });

      it('constructs a backdrop query URL with static params', function () {
        var collection = new Collection([], {
          dataSource: {
            'data-group': 'foo',
            'data-type': 'bar',
            'query-params': {
              a: 1,
              b: 'foo'
            }
          }
        });
        collection.dataSource.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
        expect(collection.url()).toEqual('//testdomain/foo/bar?a=1&b=foo');
      });

      it('constructs a backdrop query URL with multiple values for a single parameter', function () {
        var collection = new Collection([], {
          dataSource: {
            'data-group': 'foo',
            'data-type': 'bar',
            'query-params': {
              a: [1, 'foo']
            }
          }
        });
        collection.dataSource.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
        expect(collection.url()).toEqual('//testdomain/foo/bar?a=1&a=foo');
      });

      it('constructs a backdrop query URL with dynamic params', function () {
        var collection = new Collection([], {
          dataSource: {
            'data-group': 'foo',
            'data-type': 'bar'
          }
        });
        collection.dataSource.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
        collection.testProp = 'foobar';
        collection.queryParams = function() {
          return {
            a: 1,
            b: this.testProp
          };
        };
        expect(collection.url()).toEqual('//testdomain/foo/bar?a=1&b=foobar');
      });

      it('constructs a backdrop query URL with moment date params', function () {
        var collection = new Collection([], {
          dataSource: {
            'data-group': 'foo',
            'data-type': 'bar',
            'query-params': {
              a: 1,
              somedate: moment('03/08/2013 14:53:26 +00:00', 'MM/DD/YYYY HH:mm:ss T')
            }
          }
        });
        collection.dataSource.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
        expect(collection.url()).toEqual('//testdomain/foo/bar?a=1&somedate=2013-03-08T14%3A53%3A26Z');
      });
    });

    describe('sortByAttr', function () {


      describe('default comparator', function () {
        var c;
        beforeEach(function () {
          c = new Collection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 5, stringAttr: 'bar' }
          ]);
        });

        it('stores current sort attribute and direction', function () {
          c.sortByAttr('numericAttr', true);
          expect(c.sortAttr).toEqual('numericAttr');
          expect(c.sortDescending).toBe(true);

          c.sortByAttr('stringAttr');
          expect(c.sortAttr).toEqual('stringAttr');
          expect(c.sortDescending).toBe(false);
        });

        it('re-sorts collection by a numeric attribute ascending', function () {
          c.sortByAttr('numericAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
        });

        it('re-sorts collection by a numeric attribute descending', function () {
          c.sortByAttr('numericAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
        });

        it('re-sorts collection by a string attribute ascending', function () {
          c.sortByAttr('stringAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
        });

        it('re-sorts collection by a string attribute descending', function () {
          c.sortByAttr('stringAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
        });

      });

      describe('custom comparators', function () {
        var c;
        beforeEach(function () {
          var TestCollection = Collection.extend({
            comparators: {
              numericAttr: function (attr, descending) {
                return function (a, b) {
                  // sorts odd numbers first, then even numbers
                  var aVal = a.get(attr);
                  var bVal = b.get(attr);
                  if ((aVal + bVal) % 2 === 0) {
                    if (aVal < bVal) return descending ? 1 : -1;
                    if (aVal > bVal) return descending ? -1 : 1;
                    return 0;
                  }
                  if (aVal % 2 === 0) return 1;
                  if (bVal % 2 === 0) return -1;
                };
              }
            }
          });
          c = new TestCollection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 5, stringAttr: 'bar' },
            { numericAttr: 3, stringAttr: 'foo' }
          ]);
        });

        it('re-sorts collection by an attribute using a custom comparator ascending', function () {
          c.sortByAttr('numericAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 3, stringAttr: 'foo' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(3).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
        });

        it('re-sorts collection by an attribute using a custom comparator descending', function () {
          c.sortByAttr('numericAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 3, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(3).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
        });
      });

    });

    describe('defaultComparator', function () {

      describe('normal cases', function () {
        var c;
        beforeEach(function () {
          c = new Collection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 4, stringAttr: 'bar' }
          ]);
        });

        it('creates a function that sorts models by a numeric attribute ascending', function () {
          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(0);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });

        it('creates a function that sorts models by a numeric attribute descending', function () {
          var comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(0);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });

        it('creates a function that sorts models by a string attribute alphabetically, case insensitively and ascending', function () {
          var comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });

        it('creates a function that sorts models by a string attribute alphabetically, case insensitively and descending', function () {
          var comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });
      });

      describe('handling of null values', function () {
        it('creates a function that considers nulls always lower than other values', function () {
          var c = new Collection([
            { numericAttr: 4, stringAttr: null },
            { numericAttr: null, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'bar' }
          ]);
          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);

          comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);

          comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);

          comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });

        it('creates a function that does not compare null values', function () {
          var c = new Collection([
            { numericAttr: 4, stringAttr: null },
            { numericAttr: null, stringAttr: null },
            { numericAttr: null, stringAttr: 'bar' }
          ]);

          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(null);

          comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(null);

          comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(null);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);

          comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(null);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });
      });

    });

    describe('selectItem', function () {

      var collection, spy;
      beforeEach(function () {
        spy = jasmine.createSpy();
        collection = new Collection([
          { a: 'one' },
          { a: 'two' },
          { a: 'three' }
        ]);
        collection.on('change:selected', spy);
      });

      it('selects an item in the collection and triggers an event by default', function () {
        collection.selectItem(1);
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).toHaveBeenCalledWith(collection.at(1), 1, {});
      });

      it('passes options to listeners', function () {
        collection.selectItem(1, { foo: 'bar' });
        expect(spy).toHaveBeenCalledWith(collection.at(1), 1, { foo: 'bar' });
      });

      it('selects an item in the collection but allows suppressing the event', function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).not.toHaveBeenCalled();
      });

      it('does not do anything when the item is already selected', function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).not.toHaveBeenCalled();
        collection.selectItem(1);
        expect(spy).not.toHaveBeenCalled();
        collection.selectItem(2);
        expect(spy).toHaveBeenCalled();
      });

      it('does not do anything when the item is already selected unless force flag is passed', function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).not.toHaveBeenCalled();
        collection.selectItem(1, { force: true });
        expect(spy).toHaveBeenCalled();
      });

      it('unselects the current selection', function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        collection.selectItem(null);
        expect(spy).toHaveBeenCalledWith(null, null, {});
      });
    });

    describe('updating the query model', function () {

      var collection;

      beforeEach(function () {
        collection = new Collection([], {
          dataSource: {
            'data-group': 'awesomeService',
            'data-type': 'bob',
            'query-params': {
              foo: 'bar'
            }
          }
        });
        collection.dataSource.backdropUrl =  '/backdrop-stub/{{ data-group }}/{{ data-type }}';
      });

      it('gets initialized with the query parameters', function () {
        expect(collection.url()).toBe('/backdrop-stub/awesomeService/bob?foo=bar');
      });

      it('retrieves new data when the query parameters are updated', function () {
        spyOn(collection, 'fetch');

        collection.dataSource.setQueryParam('foo', 'zap');

        expect(collection.fetch).toHaveBeenCalled();
        expect(collection.url()).toContain('foo=zap');
      });

    });

    describe('getCurrentSelection', function () {
      it('retrieves the current selection', function () {
        var collection = new Collection([
          { a: 'one' },
          { a: 'two' },
          { a: 'three' }
        ]);

        var selection = collection.getCurrentSelection();
        expect(selection.selectedModelIndex).toBeFalsy();
        expect(selection.selectedModel).toBeFalsy();

        collection.selectItem(1);
        selection = collection.getCurrentSelection();
        expect(selection.selectedModelIndex).toEqual(1);
        expect(selection.selectedModel).toBe(collection.at(1));

        collection.selectItem(null);
        selection = collection.getCurrentSelection();
        expect(selection.selectedModelIndex).toBeFalsy();
        expect(selection.selectedModel).toBeFalsy();
      });
    });

    describe('getTableRows', function () {
      var collection;
      beforeEach(function () {
        collection = new Collection([
          { a: 1, b: 2, c: 'foo' },
          { a: 3, b: 4, c: 'bar' }
        ]);
      });

      it('returns an array', function () {
        expect(_.isArray(collection.getTableRows(['a', 'b']))).toEqual(true);
      });

      it('returns empty rows if no arguments are provided', function () {
        expect(collection.getTableRows()).toEqual([[], []]);
      });

      it('can handle both array args and rest args', function () {
        var expected = [[1, 2], [3, 4]];

        expect(collection.getTableRows(['a', 'b'])).toEqual(expected);
      });

      it('returns composite keys for an axis', function () {
        expect(collection.getTableRows([['a', 'c'], 'b']))
          .toEqual([[[1, 'foo'], 2], [[3, 'bar'], 4]]);
      });

      describe('processors', function () {

        beforeEach(function () {
          collection = new Collection([
            { a: 1, b: 2, 'sum(c)': 'foo' },
            { a: 3, b: 4, 'sum(c)': 'bar' }
          ]);
        });

        describe('getProcessors', function () {

          it('parses keys into processor objects', function () {
            expect(collection.getProcessors(['sum(a)'])).toEqual([{ fn: 'sum', key: 'a' }]);
          });

          it('does not return keys which have data', function () {
            expect(collection.getProcessors(['sum(c)'])).toEqual([]);
            expect(collection.getProcessors(['sum(a)', 'sum(c)'])).toEqual([{ fn: 'sum', key: 'a' }]);
          });

        });

        describe('applyProcessors', function () {

          var toString;

          beforeEach(function () {
            toString = jasmine.createSpy('toString').andCallFake(function (val) {
              return val.toString();
            });
            collection.processors.toString = function () {
              return toString;
            };
            spyOn(collection.processors, 'toString').andCallThrough();
          });

          it('gets processors', function () {
            spyOn(collection, 'getProcessors').andReturn([]);
            collection.applyProcessors(['toString(a)']);
            expect(collection.getProcessors).toHaveBeenCalledWith(['toString(a)']);
          });

          it('sets processed properties on models', function () {
            collection.applyProcessors(['toString(a)']);
            expect(collection.pluck('toString(a)')).toEqual(['1', '3']);
          });

          it('calls processor methods with value and model as arguments', function () {
            collection.applyProcessors(['toString(a)']);
            expect(toString.calls.length).toEqual(2);
            expect(toString.calls[0].args).toEqual([1, jasmine.any(Backbone.Model)]);
            expect(toString.calls[1].args).toEqual([3, jasmine.any(Backbone.Model)]);
          });

          it('calls processor factory method once with context of the collection and an argument of the key', function () {
            collection.applyProcessors(['toString(a)']);
            expect(collection.processors.toString.calls.length).toEqual(1);
            expect(collection.processors.toString.calls[0].object).toEqual(collection);
            expect(collection.processors.toString.calls[0].args).toEqual(['a']);
          });

          it('can handle arrays of keys', function () {
            collection.applyProcessors([['a', 'toString(a)']]);
            expect(collection.pluck('toString(a)')).toEqual(['1', '3']);
          });

        });

      });

    });

    describe('parse', function () {

      var input;

      beforeEach(function () {
        input = [
          {
            '_count': 2.0,
            '_group_count': 1,
            'eventDestination': 'add-extra-instructions-for-the-attorneys',
            'uniqueEvents:sum': 500.0,
            'values': [
              {
                '_count': 2.0,
                '_end_at': '2014-06-30T00:00:00+00:00',
                '_start_at': '2014-06-23T00:00:00+00:00',
                'uniqueEvents:sum': 263.0
              },
              {
                '_count': 2.0,
                '_end_at': '2014-07-07T00:00:00+00:00',
                '_start_at': '2014-06-30T00:00:00+00:00',
                'uniqueEvents:sum': 237.0
              }
            ]
          },
          {
            '_count': 1.0,
            '_group_count': 1,
            'eventDestination': 'applying-for-a-reduction-of-the-fee',
            'uniqueEvents:sum': 200.0,
            'values': [
              {
                '_count': 1.0,
                '_end_at': '2014-06-30T00:00:00+00:00',
                '_start_at': '2014-06-23T00:00:00+00:00',
                'uniqueEvents:sum': 141.0
              },
              {
                '_count': 2.0,
                '_end_at': '2014-07-07T00:00:00+00:00',
                '_start_at': '2014-06-30T00:00:00+00:00',
                'uniqueEvents:sum': 59.0
              }
            ]
          },
          {
            '_count': 1.0,
            '_group_count': 1,
            'eventDestination': 'can-i-do-it-all-using-this-tool',
            'uniqueEvents:sum': 200.0,
            'values': [
              {
                '_count': 1.0,
                '_end_at': '2014-06-30T00:00:00+00:00',
                '_start_at': '2014-06-23T00:00:00+00:00',
                'uniqueEvents:sum': 187.0
              },
              {
                '_count': 2.0,
                '_end_at': '2014-07-07T00:00:00+00:00',
                '_start_at': '2014-06-30T00:00:00+00:00',
                'uniqueEvents:sum': 13.0
              }
            ]
          }
        ];
      });

      it('returns `data` property of response', function () {

        var collection = new Collection();

        expect(collection.parse({ data: [ 1, 2, 3 ] })).toEqual([ 1, 2, 3 ]);

      });

      it('handles non date-indexed datasets', function () {

        var collection = new Collection(undefined, {
          axes: {
            'x': {
              'label': 'Description',
              'key': 'eventDestination'
            },
            'y': [
              {
                'label': 'Usage last week',
                'key': 'uniqueEvents:sum',
                'format': 'integer'
              }
            ]
          },
          dataSource: {
            'query-params': {
              'group_by': 'eventDestination',
              'collect': [
                'uniqueEvents:sum'
              ],
              'period': 'week',
              'duration': 1
            }
          }
        });

        var parsed = collection.parse({
          data: input
        });
        expect(parsed.length).toBe(3);
        expect(parsed[0]['uniqueEvents:sum']).toEqual(237);
        expect(parsed[0].values).toEqual(input[0].values);
        expect(parsed[1]['uniqueEvents:sum']).toEqual(59);
        expect(parsed[1].values).toEqual(input[1].values);
        expect(parsed[2]['uniqueEvents:sum']).toEqual(13);
        expect(parsed[2].values).toEqual(input[2].values);
      });

      it('does not require y-axes to be defined', function () {
        var collection = new Collection([], {
          dataSource: {
            'query-params': {
              'group_by': 'eventDestination',
              'collect': [
                'uniqueEvents:sum'
              ],
              'period': 'week',
              'duration': 1
            }
          }
        });

        expect(collection.parse({ data: input }).length).toEqual(3);
      });

    });

    describe('trim', function () {

      it('removes empty items from the start of the array', function () {
        var collection = new Collection([], { valueAttr: 'value' });
        var input = [
            { value: null },
            { value: 'foo' }
          ];
        collection.trim(input);
        expect(input).toEqual([ { value: 'foo' } ]);
      });

      it('keeps a minimum number of elements', function () {
        var collection = new Collection([], { valueAttr: 'value' });
        var input = [
            { value: null },
            { value: null },
            { value: null },
            { value: null },
            { value: 'foo' },
            { value: 'foo' }
          ];
        collection.trim(input, 5);
        expect(input.length).toEqual(5);
      });

    });

    describe('total', function () {

      var collection;

      beforeEach(function () {
        collection = new Collection([
          { a: 1 },
          { a: 2 },
          { a: 3 },
          { a: 4 }
        ]);
      });

      it('returns the total value of the attribute passed across all models', function () {
        expect(collection.total('a')).toEqual(10);

        collection.add({ a: 5 });

        expect(collection.total('a')).toEqual(15);
      });

      it('ignores null values', function () {
        collection.at(1).set({ a: null });

        expect(collection.total('a')).toEqual(8);
      });

      it('returns null if all values are null', function () {
        expect(collection.total('b')).toEqual(null);
      });

    });

    describe('mean', function () {

      var collection;

      beforeEach(function () {
        collection = new Collection();
        collection.reset([
          { count: 1 },
          { count: 2 },
          { count: 3 },
          { count: 4 }
        ]);
      });

      it('returns the mean of the attribute passed', function () {
        expect(collection.mean('count')).toEqual(2.5);
      });

      it('returns null for non-matching attributes', function () {
        expect(collection.mean('foo')).toEqual(null);
      });

      it('returns null for an empty collection', function () {
        collection.reset([]);
        expect(collection.mean('count')).toEqual(null);
      });

    });

  });
});
