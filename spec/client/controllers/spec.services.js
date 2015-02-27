define([
  'client/controllers/services',
  'backbone'
], function (ServicesController, Backbone) {

  describe('Services Controller', function () {

    var controller, model;

    beforeEach(function () {
      model = new Backbone.Model({
        filter: '',
        departmentFilter: '',
        serviceGroupFilter: ''
      });
      controller = new ServicesController({
        model: model,
        collection: new Backbone.Collection([])
      });
      controller.unfilteredCollection = {
        filterServices: jasmine.createSpy()
      };
    });

    it('filters when the text filter value changes', function () {
      model.set('filter', 'baz');
      expect(controller.unfilteredCollection.filterServices)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          text: 'baz'
        }));
    });

    it('filters when the department filter value changes', function () {
      model.set('departmentFilter', 'foo');
      expect(controller.unfilteredCollection.filterServices)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          department: 'foo'
        }));
    });

    it('filters the service when its filter value changes', function () {
      model.set('serviceGroupFilter', 'bar');
      expect(controller.unfilteredCollection.filterServices)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          serviceGroup: 'bar'
        }));
    });
  });

});
