define([
    'client/controllers/services',
    'client/views/table',
    'common/collections/services',
    'backbone',
    'extensions/models/model',
    'jquery'
  ],
  function (ServicesController, TableView, ServicesCollection, Backbone) {


    describe('Services view', function () {

      it('should render the view when a filter event occurs', function () {
        var controller,
          model = new Backbone.Model(),
          collection = new ServicesCollection([], {
            axes:{}
          });

        spyOn(ServicesCollection.prototype, 'filterServices').andCallFake(function () {
          return [{}];
        });
        spyOn(TableView.prototype, 'render');

        controller = new ServicesController({
          model: model,
          collection: collection
        });
        controller.renderView({
          el: '<div class="#content"><div class="visualisation-table"></div>',
          model: model,
          collection: collection
        });
        // will have been called once on initial render, so reset calls count
        TableView.prototype.render.reset();

        controller.view.filter('filter');

        expect(TableView.prototype.render.calls.length).toEqual(1);
      });

    });


  });
