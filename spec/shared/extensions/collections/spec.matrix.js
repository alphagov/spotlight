define([
  'extensions/collections/matrix',
  'extensions/collections/collection',
  'extensions/models/group'
],
function (MatrixCollection, Collection, Group) {

  describe('MatrixCollection', function () {

    describe('initialize', function () {

      it('uses Group models', function () {
        expect(MatrixCollection.prototype.model).toBe(Group);
      });

      it('listens to selection changes in all groups', function () {
        var group0 = new Group({
          values: [
            { a: 'one' },
            { a: 'two' }
          ]
        }, { parse: true });
        var group1 = new Group({
          values: [
            { a: 'three' },
            { a: 'four' }
          ]
        }, { parse: true });
        spyOn(MatrixCollection.prototype, 'onGroupChangeSelected');
        var collection = new MatrixCollection();
        collection.reset([ group0, group1 ]);

        group0.get('values').selectItem(1);
        expect(collection.onGroupChangeSelected).toHaveBeenCalledWith(
          group0, 0, group0.get('values').at(1), 1
        );

        group1.get('values').selectItem(0);
        expect(collection.onGroupChangeSelected).toHaveBeenCalledWith(
          group1, 1, group1.get('values').at(0), 0
        );
      });
    });

    describe('parse', function () {
      it('assigns constituent collections as \'values\' attribute', function () {
        var collection = new MatrixCollection([], {});
        collection.collectionInstances = [
          new Collection([ { foo: 'bar' } ]),
          new Collection([ { foo: 'baz' } ])
        ];
        collection.reset(collection.parse(), { parse: true });
        expect(collection.at(0).get('values').at(0).get('foo')).toEqual('bar');
        expect(collection.at(1).get('values').at(0).get('foo')).toEqual('baz');
      });

      it('assigns id and title properties as attributes when available', function () {
        var subCollection1 = new Collection([ { foo: 'bar' } ]);
        subCollection1.id = 'id1';
        subCollection1.title = 'Title 1';
        var subCollection2 = new Collection([ { foo: 'baz' } ]);
        subCollection2.id = 'id2';
        subCollection2.title = 'Title 2';
        var collection = new MatrixCollection([], {});
        collection.collectionInstances = [
          subCollection1,
          subCollection2
        ];
        collection.reset(collection.parse(), { parse: true });
        expect(collection.at(0).get('id')).toEqual('id1');
        expect(collection.at(0).get('title')).toEqual('Title 1');
        expect(collection.at(1).get('id')).toEqual('id2');
        expect(collection.at(1).get('title')).toEqual('Title 2');
      });
    });


    describe('selection', function () {

      var collection, spy;
      beforeEach(function () {
        spy = jasmine.createSpy();
        var group0 = new Group({
          values: [
            { a: 'one' },
            { a: 'two' }
          ]
        }, { parse: true });
        var group1 = new Group({
          values: [
            { a: 'three' },
            { a: 'four' }
          ]
        }, { parse: true });
        collection = new MatrixCollection();
        collection.on('change:selected', spy);
        collection.reset([ group0, group1 ]);
      });

      describe('selectItem', function () {

        it('selects a group', function () {
          collection.selectItem(1);

          expect(collection.selectedItem).toBe(collection.at(1));
          expect(collection.selectedIndex).toEqual(1);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(collection.at(1), 1, null, null);
        });

        it('selects an item in a group and the group and unselects all other groups', function () {
          collection.selectItem(1, 1);

          expect(collection.selectedItem).toBe(collection.at(1));
          expect(collection.selectedIndex).toEqual(1);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBe(collection.at(1).get('values').at(1));
          expect(spy).toHaveBeenCalledWith(collection.at(1), 1, collection.at(1).get('values').at(1), 1);

          collection.selectItem(0, 0);

          expect(collection.selectedItem).toBe(collection.at(0));
          expect(collection.selectedIndex).toEqual(0);
          expect(collection.at(0).get('values').selectedItem).toBe(collection.at(0).get('values').at(0));
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        });

        it('selects an item in all groups', function () {
          collection.selectItem(null, 1);

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBe(collection.at(0).get('values').at(1));
          expect(collection.at(1).get('values').selectedItem).toBe(collection.at(1).get('values').at(1));
          expect(spy).toHaveBeenCalledWith(null, null, [
            collection.at(0).get('values').at(1),
            collection.at(1).get('values').at(1)
          ], 1);

          collection.selectItem(null, 0);

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBe(collection.at(0).get('values').at(0));
          expect(collection.at(1).get('values').selectedItem).toBe(collection.at(1).get('values').at(0));
          expect(spy).toHaveBeenCalledWith(null, null, [
            collection.at(0).get('values').at(0),
            collection.at(1).get('values').at(0)
          ], 0);
        });

        it('unselects group and item', function () {
          collection.selectItem(1, 1);
          collection.selectItem(null);

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(null, null, null, null);
        });

        it('unselects item but keeps group', function () {
          collection.selectItem(1, 1);
          collection.selectItem(1, null);

          expect(collection.selectedItem).toBe(collection.at(1));
          expect(collection.selectedIndex).toEqual(1);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(collection.at(1), 1, null, null);
        });

        it('optionally toggles selection of a group', function () {
          collection.selectItem(1, null, { toggle: true });

          expect(collection.selectedItem).toBe(collection.at(1));
          expect(collection.selectedIndex).toEqual(1);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(collection.at(1), 1, null, null);

          collection.selectItem(1, null, { toggle: true });

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(collection.at(1), 1, null, null);
        });

        it('optionally toggles selection of item in a group', function () {
          collection.selectItem(1, 1, { toggle: true });

          expect(collection.selectedItem).toBe(collection.at(1));
          expect(collection.selectedIndex).toEqual(1);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBe(collection.at(1).get('values').at(1));
          expect(spy).toHaveBeenCalledWith(collection.at(1), 1, collection.at(1).get('values').at(1), 1);

          collection.selectItem(1, 1, { toggle: true });

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(null, null, null, null);
        });

        it('optionally toggles selection of an item across all group', function () {
          collection.selectItem(null, 1, { toggle: true });

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBe(collection.at(0).get('values').at(1));
          expect(collection.at(1).get('values').selectedItem).toBe(collection.at(1).get('values').at(1));
          expect(spy).toHaveBeenCalledWith(null, null, [
            collection.at(0).get('values').at(1),
            collection.at(1).get('values').at(1)
          ], 1);

          collection.selectItem(null, 1, { toggle: true });

          expect(collection.selectedItem).toBe(null);
          expect(collection.selectedIndex).toBe(null);
          expect(collection.at(0).get('values').selectedItem).toBeFalsy();
          expect(collection.at(1).get('values').selectedItem).toBeFalsy();
          expect(spy).toHaveBeenCalledWith(null, null, null, null);
        });

        it('allows suppressing the change:selected event', function () {
          collection.selectItem(1, 1, { silent: true });
          expect(spy).not.toHaveBeenCalled();
        });

      });

      describe('getCurrentSelection', function () {

        it('retrieves an object with an empty selection when nothing is selected', function () {
          collection.selectItem(null);

          var currentSelection = collection.getCurrentSelection();
          expect(currentSelection.selectedGroup).toBe(null);
          expect(currentSelection.selectedGroupIndex).toBe(null);
          expect(currentSelection.selectedModel).toBe(null);
          expect(currentSelection.selectedModelIndex).toBe(null);
        });

        it('retrieves an object with the currently selected group', function () {
          collection.selectItem(1, null);

          var currentSelection = collection.getCurrentSelection();
          expect(currentSelection.selectedGroup).toBe(collection.at(1));
          expect(currentSelection.selectedGroupIndex).toBe(1);
          expect(currentSelection.selectedModel).toBe(null);
          expect(currentSelection.selectedModelIndex).toBe(null);
        });

        it('retrieves an object with the currently selected group and item', function () {
          collection.selectItem(1, 1);

          var currentSelection = collection.getCurrentSelection();
          expect(currentSelection.selectedGroup).toBe(collection.at(1));
          expect(currentSelection.selectedGroupIndex).toBe(1);
          expect(currentSelection.selectedModel).toBe(collection.at(1).get('values').at(1));
          expect(currentSelection.selectedModelIndex).toBe(1);
        });

        it('retrieves an object with the currently selected items', function () {
          collection.selectItem(null, 1);

          var currentSelection = collection.getCurrentSelection();
          expect(currentSelection.selectedGroup).toBe(null);
          expect(currentSelection.selectedGroupIndex).toBe(null);
          expect(currentSelection.selectedModel).toEqual([
            collection.at(0).get('values').at(1),
            collection.at(1).get('values').at(1)
          ]);
          expect(currentSelection.selectedModelIndex).toBe(1);
        });
      });
    });

    describe('at', function () {
      var collection;
      beforeEach(function () {
        collection = new MatrixCollection([
          { id: 'first' }, { id: 'second' }
        ]);
        collection.at(0).set('values', new Collection([
          { a: 1, b: 2 },
          { a: 3, b: 4 }
        ]));
        collection.at(1).set('values', new Collection([
          { a: 5, b: 6 },
          { a: 7, b: null }
        ]));
      });

      it('retrieves a group', function () {
        expect(collection.at(1).get('id')).toEqual('second');
      });

      it('retrieves an item in a group', function () {
        expect(collection.at(1, 1).get('a')).toEqual(7);
        expect(collection.at(1, 1).get('b')).toBe(null);
      });
    });

    describe('aggregates', function () {

      describe('sum', function () {
        describe('default case', function () {
          var collection;
          beforeEach(function () {
            collection = new MatrixCollection([{}, {}]);
            collection.at(0).set('values', new Collection([
              { a: 1, b: 2 },
              { a: 3, b: 4 }
            ]));
            collection.at(1).set('values', new Collection([
              { a: 5, b: 6 },
              { a: 7, b: null }
            ]));
          });

          it('sums a given attribute for all items in all groups', function () {
            expect(collection.sum('a')).toEqual(16);
            expect(collection.sum('b')).toEqual(12);
          });

          it('sums a given attribute for all items in a specific group', function () {
            expect(collection.sum('a', 1)).toEqual(12);
            expect(collection.sum('b', 1)).toEqual(6);
          });

          it('sums a given attribute for a specific item in all groups', function () {
            expect(collection.sum('a', null, 1)).toEqual(10);
            expect(collection.sum('b', null, 1)).toEqual(4);
          });
        });

        describe('null case', function () {
          var collection;
          beforeEach(function () {
            collection = new MatrixCollection([{}, {}]);
            collection.at(0).set('values', new Collection([
              { a: null, b: null },
              { a: null, b: null }
            ]));
            collection.at(1).set('values', new Collection([
              { a: null, b: null },
              { a: null, b: null }
            ]));
          });

          it('sums a given attribute for all items in all groups', function () {
            expect(collection.sum('a')).toEqual(null);
            expect(collection.sum('b')).toEqual(null);
          });

          it('sums a given attribute for all items in a specific group', function () {
            expect(collection.sum('a', 1)).toEqual(null);
            expect(collection.sum('b', 1)).toEqual(null);
          });

          it('sums a given attribute for a specific item in all groups', function () {
            expect(collection.sum('a', null, 1)).toEqual(null);
            expect(collection.sum('b', null, 1)).toEqual(null);
          });
        });
      });

      describe('fraction', function () {
        var collection;
        beforeEach(function () {
          collection = new MatrixCollection([{}, {}]);
          collection.at(0).set('values', new Collection([
            { a: 1, b: 2, c: 0, d: 0 },
            { a: 3, b: 4, c: 0, d: 0 }
          ]));
          collection.at(1).set('values', new Collection([
            { a: 5, b: 6, c: 0, d: 10 },
            { a: 7, b: null, c: 0, d: 10 }
          ]));
        });

        it('always returns 1 when applied to all groups and items', function () {
          expect(collection.fraction('a')).toEqual(1);
          expect(collection.fraction('b')).toEqual(1);
        });

        it('calculates the fraction for a given attribute for all items in a specific group', function () {
          expect(collection.fraction('a', 1)).toBeCloseTo(0.75, 5);
          expect(collection.fraction('b', 1)).toBeCloseTo(0.5, 5);
        });

        it('calculates the fraction for a given attribute for a specific item in all groups', function () {
          expect(collection.fraction('a', null, 1)).toBeCloseTo(0.625, 5);
          expect(collection.fraction('b', null, 1)).toBeCloseTo(0.33333, 5);
        });

        it('calculates the fraction for a given attribute for a specific item in a specific group', function () {
          expect(collection.fraction('a', 1, 0)).toBeCloseTo(0.83333, 5);
          expect(collection.fraction('a', 1, 1)).toBeCloseTo(0.70, 5);
          expect(collection.fraction('b', 1, 0)).toBeCloseTo(0.75, 5);
          expect(collection.fraction('b', 1, 1)).toEqual(0);
        });

        it('returns null if sum is zero', function () {
          expect(collection.fraction('c', 1, 1)).toBeNull();
          expect(collection.fraction('notathing', 1, 1)).toBeNull();
        });

        it('returns zero for zero values with a positiive sum', function () {
          expect(collection.fraction('d', 0, 0)).toEqual(0);
          expect(collection.fraction('d', 0, 1)).toEqual(0);
        });
      });

      describe('max', function () {
        var collection;
        beforeEach(function () {
          collection = new MatrixCollection([{}, {}]);
          collection.at(0).set('values', new Collection([
            { a: 1, b: 2 },
            { a: 3, b: 4 }
          ]));
          collection.at(1).set('values', new Collection([
            { a: 5, b: 6 },
            { a: 7, b: null }
          ]));
        });

        it('calculates the maximum value of an attribute', function () {
          expect(collection.max('a')).toEqual(7);
          expect(collection.max('b')).toEqual(6);
        });

        it('handles undefined values', function () {
          collection.at(0).set('values', new Collection([{ a: 1 }]));
          collection.at(1).set('values', new Collection([{ a: 1 }]));
          expect(collection.max('b')).toBeNaN();
        });

        it('handles empty datasets', function () {
          collection.at(0).set('values', new Collection([]));
          collection.at(1).set('values', new Collection([]));
          expect(collection.max('b')).toBeNaN();
        });

      });

      describe('getTableRows', function () {
        var collection;
        beforeEach(function () {
          collection = new MatrixCollection([{}, {}]);
          collection.at(0).set('values', new Collection([
            { a: 1, b: 3, c: 'foo1' },
            { a: 2, b: 4, c: 'foo2' }
          ]));
          collection.at(1).set('values', new Collection([
            { a: 1, b: 5, c: 'foo3' },
            { a: 2, b: null, c: 'foo4' }
          ]));
        });

        it('returns an array of arrays', function () {
          expect(_.isArray(collection.getTableRows(['a', 'b']))).toEqual(true);
          expect(_.isArray(collection.getTableRows(['a', 'b'])[0])).toEqual(true);
          expect(_.isArray(collection.getTableRows(['a', 'b'])[1])).toEqual(true);
        });

        it('returns single dimensional array when top-level collection has only one entry', function () {
          collection.pop();
          expect(collection.getTableRows(['a'])).toEqual([[1], [2]]);
        });

        it('can handle array args', function () {
          var expected = [[1, 3, 5], [2, 4, null]];

          expect(collection.getTableRows(['a', 'b'])).toEqual(expected);
        });

        it('can handle composite keys', function () {
          var expected = [[[1, 'foo1'], 3, 5], [[2, 'foo2'], 4, null]];

          expect(collection.getTableRows([['a', 'c'], 'b'])).toEqual(expected);
        });
      });

    });

    describe('sortByAttr', function () {

      var collection;
      beforeEach(function () {
        collection = new MatrixCollection([{}, {}]);
        collection.at(0).set('values', new Collection([
          { a: 5, b: 1 },
          { a: 4, b: 2 }
        ]));
        collection.at(1).set('values', new Collection([
          { a: 1, b: 2 },
          { a: 2, b: 1 }
        ]));
      });

      it('sorts child collections', function () {

        spyOn(Collection.prototype, 'sortByAttr');

        collection.sortByAttr('a', true, {});

        expect(collection.at(0).get('values').sortByAttr).toHaveBeenCalledWith('a', true, {});
        expect(collection.at(1).get('values').sortByAttr).toHaveBeenCalledWith('a', true, {});

      });

    });

    describe('isEmpty', function () {

      var collection;
      beforeEach(function () {
        collection = new MatrixCollection([{}, {}]);
        collection.at(0).set('values', new Collection([]));
        collection.at(1).set('values', new Collection([]));
      });

      it('returns true if all of the child collections are empty', function () {
        expect(collection.isEmpty()).toEqual(true);
      });

      it('returns true if the collection itself if empty', function () {
        collection.reset();
        expect(collection.isEmpty()).toEqual(true);
      });

      it('returns false if any of the child collections are non-empty', function () {
        collection.at(0).get('values').add({ foo: 1});
        expect(collection.isEmpty()).toEqual(false);
      });

    });

  });
});
