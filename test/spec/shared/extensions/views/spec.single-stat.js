define([
  'extensions/views/single_stat',
  'extensions/collections/collection'
], function (SingleStatView, Collection) {
  describe("SingleStatView", function () {

    var collectionOptions = {
      checkName: "anything",
      "data-group": "anything",
      "data-type": "monitoring"
    };

    describe("initialize", function () {
      describe("collection events", function () {
        var view, collection;
        beforeEach(function () {
          spyOn(SingleStatView.prototype, 'render');
          collection = new Collection();
          view = new SingleStatView({
            collection: collection
          });
        });

        it("re-renders on reset", function () {
          collection.trigger('reset');
          expect(view.render).toHaveBeenCalled();
        });

        it("re-renders on sync", function () {
          collection.trigger('sync');
          expect(view.render).toHaveBeenCalled();
        });

        it("re-renders on error", function () {
          collection.trigger('error');
          expect(view.render).toHaveBeenCalled();
        });
      });
    });

    describe("extracting the stat from the collection", function () {

      var stubCollection = {
        on: function () {},
        getValue: function () { return 5; },
        getCurrentSelection: function () {
          return {
            selectedModel: null,
            selectedModelIndex: null
          };
        }
      };

      it("Should try to get a value from a collection", function () {
        spyOn(stubCollection, 'getValue').andCallThrough();
        view = new SingleStatView({
          collection: stubCollection,
          getValue: function () { return this.collection.getValue(); }
        });
        jasmine.renderView(view, function () {
          expect(stubCollection.getValue).toHaveBeenCalled();
          expect(view.$el.html()).toEqual("<strong>5</strong>");
        });
      });
    });

    it("should display calculated value in a strong tag by default", function () {
      var collection = new Collection([{
        "foo": 'bar'
      }], collectionOptions);

      var view = new SingleStatView({
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>bar</strong>");
      });
    });

    it("should display calculated value in a custom wrapping tag when configured", function () {
      var collection = new Collection([{
        "foo": 'bar'
      }], collectionOptions);

      var view = new SingleStatView({
        valueTag: 'em',
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<em>bar</em>");
      });
    });

    it("should display calculated value without a wrapping tag when configured", function () {
      var collection = new Collection([{
        "foo": 'bar'
      }], collectionOptions);

      var view = new SingleStatView({
        valueTag: '',
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("bar");
      });
    });

    it("should display calculated value and label", function () {
      var collection = new Collection([{
        "foo": 'bar'
      }], collectionOptions);

      var view = new SingleStatView({
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        },
        getLabel: function () {
          return 'label';
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>bar</strong> label");
      });
    });

    it("should not display different values when the selection changes by default", function () {
      var collection = new Collection([{
        "foo": 'bar'
      }], collectionOptions);

      var view = new SingleStatView({
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        },
        getLabel: function () {
          return 'label';
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>bar</strong> label");
        collection.selectItem(0);
        expect(view.$el.html()).toEqual("<strong>bar</strong> label");
      });
    });

    it("should display different values when the selection changes when configured", function () {
      var collection = new Collection([{
        foo: 'bar',
        a: 'b'
      }], collectionOptions);

      var view = new SingleStatView({
        changeOnSelected: true,
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        },
        getLabel: function () {
          return 'label';
        },
        getValueSelected: function (selection) {
          return selection.selectedModel.get('a');
        },
        getLabelSelected: function (selection) {
          return 'selected';
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>bar</strong> label");
        collection.selectItem(0);
        expect(view.$el.html()).toEqual("<strong>b</strong> selected");
        collection.selectItem(null);
        expect(view.$el.html()).toEqual("<strong>bar</strong> label");
      });
    });

    it("should display (no data) when data is missing", function () {
      var collection = new Collection([{
        "foo": null
      }], collectionOptions);

      var view = new SingleStatView({
        collection: collection,
        getValue: function () {
          return this.collection.first().get('foo');
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<span class=\"no-data\">(no data)</span>");
      });
    });
  });
});
