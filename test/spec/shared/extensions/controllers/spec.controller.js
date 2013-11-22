define([
  'extensions/controllers/controller',
  'extensions/views/view',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (Controller, View, Model, Collection) {
  describe("Controller", function () {
    describe("render", function () {

      var model;
      beforeEach(function() {
        model = new Model({
          'data-type': 'foo-type',
          'data-group': 'bar-group'
        });
        spyOn(Controller.prototype, "renderView");
        spyOn(Collection.prototype, "fetch");
      });

      it("waits for collection data to be available and then renders view", function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection
        });
        controller.render();
        
        expect(controller.renderView).not.toHaveBeenCalled();
        expect(controller.collection instanceof Collection).toBe(true);
        expect(controller.collection.options['data-type']).toEqual('foo-type');
        expect(controller.collection.options['data-group']).toEqual('bar-group');
        expect(controller.collection.fetch).toHaveBeenCalled();

        controller.collection.trigger('sync');
        expect(controller.renderView).toHaveBeenCalled();
      });

      it("waits for collection data and renders view on error", function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection,
          collectionOptions: function () {
            return {
              foo: 'bar'
            };
          }
        });
        controller.render();
        
        expect(controller.renderView).not.toHaveBeenCalled();
        expect(controller.collection instanceof Collection).toBe(true);
        expect(controller.collection.options['data-type']).toEqual('foo-type');
        expect(controller.collection.options['data-group']).toEqual('bar-group');
        expect(controller.collection.options.foo).toEqual('bar');
        expect(controller.collection.fetch).toHaveBeenCalled();

        controller.collection.trigger('error');
        expect(controller.renderView).toHaveBeenCalled();
      });

      it("immediately renders the view when there is no collection", function () {
        var controller = new Controller({
          model: model,
          viewClass: View
        });
        controller.render();
        expect(controller.collection).not.toBeDefined();
        expect(controller.renderView).toHaveBeenCalled();
      });

      it("render view on init on the server", function () {
        jasmine.serverOnly(function () {
          var controller = new Controller({
            model: model,
            viewClass: View,
            collectionClass: Collection
          });
          controller.render({ init: true });
          expect(controller.renderView).not.toHaveBeenCalled();
          controller.collection.trigger('sync');
          expect(controller.renderView).toHaveBeenCalled();
        });
      });

      it("does not render view on init on the client by default", function () {
        jasmine.clientOnly(function () {
          var controller = new Controller({
            model: model,
            viewClass: View,
            collectionClass: Collection
          });
          var isReady = false;
          controller.once('ready', function () {
            isReady = true;
          });
          controller.render({ init: true });
          expect(controller.renderView).not.toHaveBeenCalled();
          controller.collection.trigger('sync');
          expect(controller.renderView).not.toHaveBeenCalled();
          expect(isReady).toBe(true);
        });
      });

      it("renders view on init on the client when configured", function () {
        jasmine.clientOnly(function () {
          var controller = new Controller({
            model: model,
            viewClass: View,
            collectionClass: Collection,
            clientRenderOnInit: true
          });
          controller.render({ init: true });
          expect(controller.renderView).not.toHaveBeenCalled();
          controller.collection.trigger('sync');
          expect(controller.renderView).toHaveBeenCalled();
        });
      });

    });
    
    describe("renderView", function () {

      var controller, model;
      beforeEach(function() {
        spyOn(View.prototype, "render");
        model = new Model({
          'data-type': 'foo-type',
          'data-group': 'bar-group'
        });
        var TestView = View.extend({
          render: function () {
            this.$el.html('content');
          }
        });

        controller = new Controller({
          model: model,
          viewClass: TestView,
          viewOptions: function () {
            return {
              foo: 'bar'
            };
          }
        });
      });

      it("instantiates the view class and renders the content", function () {
        controller.renderView();
        expect(controller.html).toEqual('<div>content</div>');
        expect(controller.view.foo).toEqual('bar');
      });

      it("triggers a 'ready' event", function () {
        var triggered = false;
        controller.once('ready', function () {
          triggered = true;
        });
        controller.renderView();
        expect(triggered).toBe(true);
      });
    });
  });
});
