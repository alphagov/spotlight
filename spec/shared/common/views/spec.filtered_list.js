define([
  'common/views/filtered_list',
  'backbone'
], function (FilteredListView, Backbone) {

  describe('Filtered List View', function () {

    var view;

    beforeEach(function () {
      spyOn(FilteredListView.prototype, 'render');
      view = new FilteredListView({
        model: new Backbone.Model(),
        collection: {
          alphabetise: jasmine.createSpy().andReturn({ alphabetised: 'data' })
        }
      });
    });

    it('renders on model change:filter', function () {
      view.model.set('filter', 'foo');
      expect(view.render).toHaveBeenCalled();
    });

    it('renders on model change:departmentFilter', function () {
      view.model.set('departmentFilter', 'home-office');
      expect(view.render).toHaveBeenCalled();
    });

    describe('templateContext', function () {

      it('adds output from collection.alphabetise to template context', function () {
        var output = view.templateContext();
        expect(output).toEqual({ items: { alphabetised: 'data' } });
      });

      it('includes model data in template context', function () {
        view.model.set({
          model: 'data'
        });
        var output = view.templateContext();
        expect(output).toEqual({ model: 'data', items: { alphabetised: 'data' } });
      });

    });

  });

});
