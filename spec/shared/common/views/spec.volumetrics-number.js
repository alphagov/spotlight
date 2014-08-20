define([
  'common/views/visualisations/volumetrics/number',
  'extensions/collections/collection'
], function (NumberView, Collection) {
  describe('NumberView', function () {

    var collectionOptions = {
      checkName: 'anything',
      'data-group': 'anything',
      'data-type': 'monitoring'
    };

    describe('initialize', function () {

      describe('collection events', function () {

        var view, collection;

        beforeEach(function () {
          spyOn(NumberView.prototype, 'render');
          collection = new Collection();
          view = new NumberView({
            collection: collection
          });
        });

        it('re-renders on reset', function () {
          collection.trigger('reset');
          expect(view.render).toHaveBeenCalled();
        });

        it('re-renders on sync', function () {
          collection.trigger('sync');
          expect(view.render).toHaveBeenCalled();
        });

        it('re-renders on error', function () {
          collection.trigger('error');
          expect(view.render).toHaveBeenCalled();
        });

        it('renders on change:selected', function () {
          collection.trigger('change:selected');
          expect(view.render).toHaveBeenCalled();
        });

      });
    });

    it('should display calculated value in a strong tag by default', function () {
      var collection = new Collection([{
        'foo': 6
      }], collectionOptions);

      var view = new NumberView({
        collection: collection,
        valueAttr: 'foo'
      });

      view.render();
      expect(view.$el.html()).toEqual('<strong>6</strong>');
    });

    it('should display calculated value in a custom wrapping tag when configured', function () {
      var collection = new Collection([{
        'foo': 6
      }], collectionOptions);

      var view = new NumberView({
        valueTag: 'em',
        collection: collection,
        valueAttr: 'foo'
      });

      view.render();
      expect(view.$el.html()).toEqual('<em>6</em>');

    });

    it('should display calculated value without a wrapping tag when configured', function () {
      var collection = new Collection([{
        'foo': 6
      }], collectionOptions);

      var view = new NumberView({
        valueTag: '',
        collection: collection,
        valueAttr: 'foo'
      });

      view.render();
      expect(view.$el.html()).toEqual('6');

    });

    it('should display calculated value and label', function () {
      var collection = new Collection([{
        'foo': 6
      }], collectionOptions);

      var view = new NumberView({
        collection: collection,
        valueAttr: 'foo',
        getLabel: function () {
          return 'label';
        }
      });

      view.render();
      expect(view.$el.html()).toEqual('<span class="summary">label</span><strong>6</strong>');
    });

    it('should not display different values when the selection changes by default', function () {
      var collection = new Collection([{
        'foo': 6
      }], collectionOptions);

      var view = new NumberView({
        collection: collection,
        valueAttr: 'foo',
        getLabel: function () {
          return 'label';
        }
      });

      view.render();
      expect(view.$el.html()).toEqual('<span class="summary">label</span><strong>6</strong>');
      collection.selectItem(0);
      expect(view.$el.html()).toEqual('<span class="summary">label</span><strong>6</strong>');
    });

    it('should display different values when the selection changes when configured', function () {
      var collection = new Collection([{
        foo: 6,
        a: 'b'
      }], collectionOptions);

      var view = new NumberView({
        collection: collection,
        valueAttr: 'foo',
        getLabel: function () {
          return 'label';
        },
        getValueSelected: function (selection) {
          return selection.selectedModel.get('a');
        },
        getLabelSelected: function () {
          return 'selected';
        }
      });

      view.render();
      expect(view.$el.html()).toEqual('<span class="summary">label</span><strong>6</strong>');
      collection.selectItem(0);
      expect(view.$el.html()).toEqual('<span class="summary">selected</span><strong>b</strong>');
      collection.selectItem(null);
      expect(view.$el.html()).toEqual('<span class="summary">label</span><strong>6</strong>');
    });

    it('should display (no data) when data is missing', function () {
      var collection = new Collection([{
        'foo': null
      }], collectionOptions);

      var view = new NumberView({
        collection: collection,
        valueAttr: 'foo'
      });

      view.render();
      expect(view.$el.html()).toEqual('<span class="no-data">(no data)</span>');
    });
  });
});
