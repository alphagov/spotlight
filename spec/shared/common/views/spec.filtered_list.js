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
        expect(output).toEqual({ items: { alphabetised: 'data' }, title: 'services' });
      });

      it('includes model data in template context', function () {
        view.model.set({
          model: 'data'
        });
        var output = view.templateContext();
        expect(output).toEqual({ model: 'data', items: { alphabetised: 'data' }, title: 'services' });
      });

      describe('title', function () {
        it('includes the text filter if set', function () {
          view.model.set({
            filter: 'blood'
          });
          var output = view.templateContext();
          expect(output.title).toEqual('services matching <strong> blood </strong>');
        });

        it('includes the department filter if set', function () {
          view.model.set({
            departmentFilter: 'home-office',
            departments: [{ title: 'Home Office', abbr: 'Home Office', slug: 'home-office'}]
          });
          var output = view.templateContext();
          expect(output.title).toEqual('services for <strong> Home Office </strong> <span class="filter-remove" data-filter="department"></span>');
        });

        it('includes the agency filter if set', function () {
          view.model.set({
            agencyFilter: 'ea',
            agencies: [{ title: 'Environment Agency', abbr: 'EA', slug: 'ea'}]
          });
          var output = view.templateContext();
          expect(output.title).toEqual('services for <strong> Environment Agency </strong> <span class="filter-remove" data-filter="agency"></span>');
        });

        it('combines the department and agency filter if both set', function () {
          view.model.set({
            agencyFilter: 'ea',
            agencies: [{ title: 'Environment Agency', abbr: 'EA', slug: 'ea'}],
            departmentFilter: 'home-office',
            departments: [{ title: 'Home Office', abbr: 'Home Office', slug: 'home-office'}]
          });
          var output = view.templateContext();
          expect(output.title).toEqual('services for <strong> Home Office </strong> <span class="filter-remove" data-filter="department"></span> and <strong> Environment Agency </strong> <span class="filter-remove" data-filter="agency"></span>');
        });
      });

    });

  });

});
