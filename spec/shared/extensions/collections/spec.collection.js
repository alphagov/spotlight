define([
  'extensions/collections/collection',
  'extensions/models/model',
  'backbone',
  'jquery'
],
function (Collection, Model, Backbone, $) {
  describe("Collection", function() {

    it("inherits from Backbone.Collection", function() {
      var collection = new Collection();
      expect(collection instanceof Backbone.Collection).toBe(true);
    });

    it("sets the extended Model as default model", function() {
      var collection = new Collection([{foo: 'bar'}]);
      expect(collection.models[0] instanceof Model).toBe(true);
    });

    describe("initialize", function() {
      it("creates instances of constituent collections with default options", function() {
        var Part1 = Collection.extend({});
        var Part2 = Collection.extend({});
        var collection = new Collection([], {
          collections: [Part1, Part2]
        });
        expect(collection.collectionInstances[0] instanceof Part1).toBe(true);
        expect(collection.collectionInstances[1] instanceof Part2).toBe(true);
      });

      it("creates instances of constituent collections with custom options", function() {
        var Part1 = Collection.extend({});
        var Part2 = Collection.extend({});
        var collection = new Collection([], {
          collections: [
            {
              collection: Part1,
              options: {
                foo: 'bar'
              }
            },
            {
              collection: Part2,
              options: {
                foo: 'baz'
              }
            }
          ]
        });
        expect(collection.collectionInstances[0] instanceof Part1).toBe(true);
        expect(collection.collectionInstances[1] instanceof Part2).toBe(true);
        expect(collection.collectionInstances[0].options.foo).toEqual('bar');
        expect(collection.collectionInstances[1].options.foo).toEqual('baz');
      });
    });

    describe("prop", function() {
      it("retrieves an object property", function() {
        var collection = new Collection();
        collection.testProp = { foo: 'bar' };
        expect(collection.prop('testProp')).toEqual({ foo: 'bar' });
      });

      it("retrieves an object method result", function() {
        var collection = new Collection();
        collection.otherProp = { foo: 'bar' };
        collection.testProp = function () {
          return this.otherProp;
        };
        expect(collection.prop('testProp')).toEqual({ foo: 'bar' });
      });

      it("retrieves property from another object", function() {
        var collection = new Collection();
        var anotherObject = {
          testProp: { foo: 'bar' }
        };
        expect(collection.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });

      it("retrieves method result from another object", function() {
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

    describe("fetch", function () {
      var TestCollection;
      beforeEach(function() {
        TestCollection = Collection.extend({
          backdropUrl: '//testdomain/{{ data-group }}/{{ data-type }}',
          'data-group': 'service',
          'data-type': 'apiname',
          queryId: 'testid'
        });
        spyOn(TestCollection.prototype, "sync");
        spyOn(TestCollection.prototype, "fetchParts");
      });

      it("adds a unique identifier to the request", function () {
        var collection = new TestCollection();
        collection.fetch();
        expect(collection.sync.argsForCall[0][2].queryId).toEqual('testid');
      });

      it("retrieves data by default", function () {
        var collection = new TestCollection();
        collection.fetch();
        expect(TestCollection.prototype.sync).toHaveBeenCalled();
        expect(TestCollection.prototype.fetchParts).not.toHaveBeenCalled();
      });

      it("retrieves data for constituent parts when configured", function () {
        TestCollection.prototype.collections = [
          Collection
        ];
        var collection = new TestCollection();
        collection.fetch();
        expect(TestCollection.prototype.sync).not.toHaveBeenCalled();
        expect(TestCollection.prototype.fetchParts).toHaveBeenCalled();
      });
    });

    describe("fetchParts", function() {
      var collection, part1, part2;
      beforeEach(function() {
        collection = new Collection();
        var Part1Collection = Collection.extend({
          queryParams: {part: 'one'},
          fetch: jasmine.createSpy(),
          on: jasmine.createSpy()
        });
        var Part2Collection = Collection.extend({
          queryParams: {part: 'two'},
          fetch: jasmine.createSpy(),
          on: jasmine.createSpy()
        });
        part1 = new Part1Collection();
        part2 = new Part2Collection();
        collection.collectionInstances = [part1, part2];
        spyOn(collection, "parse");
      });
      
      it("propagates shared query parameters to all collections", function () {
        collection.query.set('foo', 'bar');
        expect(part1.query.attributes).toEqual({ foo: 'bar', part: 'one' });
        expect(part2.query.attributes).toEqual({ foo: 'bar', part: 'two' });
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
      });
      
      it("fetches data for all collections", function() {
        collection.fetch();
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
      });
      
      it("parses data once all collections have fetched successfully", function() {
        collection.fetch();
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
        expect(collection.parse).not.toHaveBeenCalled();
        
        part2.fetch.argsForCall[0][0].success();
        expect(collection.parse).not.toHaveBeenCalled();
        
        part1.fetch.argsForCall[0][0].success();
        expect(collection.parse).toHaveBeenCalled();
      });
      
      it("fails as soon as a request fails", function() {
        var onError1 = jasmine.createSpy();
        var onError2 = jasmine.createSpy();
        
        collection.fetch({
          error: onError1
        });
        collection.on('error', onError2);
        
        expect(part2.on.argsForCall[0][0]).toEqual('error');
        var onErrorListener = part2.on.argsForCall[0][1];
        
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
        expect(onError1).not.toHaveBeenCalled();
        expect(onError2).not.toHaveBeenCalled();
        
        // part 2 fails - the error is escalated immediately
        onErrorListener.call(collection);
        expect(collection.parse).not.toHaveBeenCalled();
        expect(onError1).toHaveBeenCalled();
        expect(onError2).toHaveBeenCalled();
        
        // part 1 returns successfully - parse is still not called
        part1.fetch.argsForCall[0][0].success();
        expect(collection.parse).not.toHaveBeenCalled();
      });
      
    });
    
    describe("url", function() {

      var TestCollection;
      beforeEach(function() {
        TestCollection = Collection.extend({
          backdropUrl: '//testdomain/{{ data-group }}/foo/{{ data-type }}',
          'data-group': 'service',
          'data-type': 'apiname'
        });
      });

      it("constructs a backdrop query URL without params", function() {
        var collection = new TestCollection();
        expect(collection.url()).toEqual('//testdomain/service/foo/apiname?');
      });

      it("constructs a backdrop query URL with static params", function() {
        TestCollection.prototype.queryParams = {
          a: 1,
          b: 'foo bar'
        };

        var collection = new TestCollection();

        expect(collection.url()).toEqual('//testdomain/service/foo/apiname?a=1&b=foo+bar');
      });

      it("constructs a backdrop query URL with multiple values for a single parameter", function() {
        TestCollection.prototype.queryParams = {
          a: [1, 'foo']
        };

        var collection = new TestCollection();

        expect(collection.url()).toEqual('//testdomain/service/foo/apiname?a=1&a=foo');
      });

      it("constructs a backdrop query URL with dynamic params", function() {
        TestCollection.prototype.queryParams = function () {
          return {
            a: 1,
            b: this.testProp
          };
        };
        TestCollection.prototype.testProp = 'foo bar';

        var collection = new TestCollection();

        expect(collection.url()).toEqual('//testdomain/service/foo/apiname?a=1&b=foo+bar');
      });

      it("constructs a backdrop query URL with moment date params", function() {

        TestCollection.prototype.testProp = 'foo bar';
        TestCollection.prototype.queryParams = function () {
          return {
            a: 1,
            somedate: this.moment('03/08/2013 14:53:26 +00:00', 'MM/DD/YYYY HH:mm:ss T')
          };
        };

        var collection = new TestCollection();
        expect(collection.url()).toEqual('//testdomain/service/foo/apiname?a=1&somedate=2013-03-08T14%3A53%3A26%2B00%3A00');
      });

      it("constructs a backdrop query URL with a single filter parameter", function () {

        TestCollection.prototype.queryParams = function () {
          return {
            a: 1
          };
        };

        TestCollection.prototype.filterBy = {foo: "bar"};

        var collection = new TestCollection();

        var url = collection.url()

        expect(url).toMatch('//testdomain/service/foo/apiname?');
        expect(url).toMatch('filter_by=foo%3Abar');
        expect(url).toMatch('a=1');
      });

      it("constructs a backdrop query URL with multiple filter parameters", function () {
        TestCollection.prototype.queryParams = function () {
          return {
            a: 1
          };
        };

        TestCollection.prototype.filterBy = {foo: 'bar', b: 'c'};

        var collection = new TestCollection();

        var url = collection.url()
        expect(url).toMatch('//testdomain/service/foo/apiname?');
        expect(url).toMatch('filter_by=foo%3Abar');
        expect(url).toMatch('filter_by=b%3Ac');
        expect(url).toMatch('a=1');
      });
    });

    describe("sortByAttr", function () {


      describe("default comparator", function () {
        var c;
        beforeEach(function() {
          c = new Collection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 5, stringAttr: 'bar' }
          ]);
        });

        it("stores current sort attribute and direction", function () {
          c.sortByAttr('numericAttr', true);
          expect(c.sortAttr).toEqual('numericAttr');
          expect(c.sortDescending).toBe(true);

          c.sortByAttr('stringAttr');
          expect(c.sortAttr).toEqual('stringAttr');
          expect(c.sortDescending).toBe(false);
        });

        it("re-sorts collection by a numeric attribute ascending", function () {
          c.sortByAttr('numericAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
        });

        it("re-sorts collection by a numeric attribute descending", function () {
          c.sortByAttr('numericAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
        });

        it("re-sorts collection by a string attribute ascending", function () {
          c.sortByAttr('stringAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
        });

        it("re-sorts collection by a string attribute descending", function () {
          c.sortByAttr('stringAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
        });

      });

      describe("custom comparators", function () {
        var c;
        beforeEach(function() {
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

        it("re-sorts collection by an attribute using a custom comparator ascending", function () {
          c.sortByAttr('numericAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 3, stringAttr: 'foo' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(3).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
        });

        it("re-sorts collection by an attribute using a custom comparator descending", function () {
          c.sortByAttr('numericAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 3, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(3).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
        });
      });

    });

    describe("defaultComparator", function () {

      describe("normal cases", function () {
        var c;
        beforeEach(function() {
          c = new Collection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 4, stringAttr: 'bar' }
          ]);
        });

        it("creates a function that sorts models by a numeric attribute ascending", function () {
          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(0);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });

        it("creates a function that sorts models by a numeric attribute descending", function () {
          var comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(0);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });

        it("creates a function that sorts models by a string attribute alphabetically, case insensitively and ascending", function () {
          var comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });

        it("creates a function that sorts models by a string attribute alphabetically, case insensitively and descending", function () {
          var comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });
      });

      describe("handling of null values", function () {
        it("creates a function that considers nulls always lower than other values", function () {
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

        it("creates a function that does not compare null values", function () {
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

    describe("selectItem", function () {
      
      var collection, spy;
      beforeEach(function() {
        spy = jasmine.createSpy();
        collection = new Collection([
          { a: 'one' },
          { a: 'two' },
          { a: 'three' }
        ]);
        collection.on('change:selected', spy);
      });
      
      it("selects an item in the collection and triggers an event by default", function () {
        collection.selectItem(1);
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).toHaveBeenCalledWith(collection.at(1), 1);
      });
      
      it("selects an item in the collection but allows suppressing the event", function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).not.toHaveBeenCalled();
      });
      
      it("does not do anything when the item is already selected", function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(spy).not.toHaveBeenCalled();
        collection.selectItem(1);
        expect(spy).not.toHaveBeenCalled();
        collection.selectItem(2);
        expect(spy).toHaveBeenCalled();
      });
      
      it("unselects the current selection", function () {
        collection.selectItem(1, { silent: true });
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        collection.selectItem(null);
        expect(spy).toHaveBeenCalledWith(null, null);
      });
    });

    describe("updating the query model", function () {

      var SubclassOfCollection = undefined;

      beforeEach(function () {
        SubclassOfCollection = Collection.extend({
          queryParams: {foo: 'bar'},
          backdropUrl: '/backdrop-stub/{{ data-group }}/{{ data-type }}',
          'data-group': 'awesomeService',
          'data-type': 'bob'
        });
      });

      it("gets initialized with the query parameters", function () {
        var subclassOfCollection = new SubclassOfCollection();

        expect(subclassOfCollection.url()).toBe("/backdrop-stub/awesomeService/bob?foo=bar");
      });

      it("retrieves new data when the query parameters are updated", function () {
        spyOn(Collection.prototype, "fetch")
        var subclassOfCollection = new SubclassOfCollection();

        subclassOfCollection.query.set('foo', 'zap');

        expect(subclassOfCollection.fetch).toHaveBeenCalled();
        expect(subclassOfCollection.url()).toContain("foo=zap");
      });

    });

    describe("getCurrentSelection", function () {
      it("retrieves the current selection", function () {
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
  });
});
