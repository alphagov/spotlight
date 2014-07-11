define([
  'extensions/controllers/controller',
  'extensions/views/view',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (Controller, View, Model, Collection) {
  describe('Controller', function () {

    describe('renderModules', function () {

      it('renders modules and then fires a callback', function () {

        var Module1 = Controller.extend({
          render: jasmine.createSpy()
        });
        var Module2 = Controller.extend({
          render: jasmine.createSpy()
        });
        var renderCallback = jasmine.createSpy('renderCallback');

        var model = new Model({
          modules: [
            {
              controller: Module1,
              metadata: 'foo'
            },
            {
              controller: Module2,
              metadata: 'bar'
            }
          ]
        });

        var controller = new Controller();
        var instances = controller.renderModules(model.get('modules'), model, {}, { foo: 'bar' }, renderCallback);

        expect(instances[0] instanceof Module1).toBe(true);
        expect(instances[0].render).toHaveBeenCalled();
        expect(instances[0].render).toHaveBeenCalledWith({ foo: 'bar' });
        expect(instances[0].model.get('metadata')).toEqual('foo');
        expect(instances[0].model.get('parent')).toBe(model);

        expect(instances[1] instanceof Module2).toBe(true);
        expect(instances[1].render).toHaveBeenCalled();
        expect(instances[1].render).toHaveBeenCalledWith({ foo: 'bar' });
        expect(instances[1].model.get('metadata')).toEqual('bar');
        expect(instances[1].model.get('parent')).toBe(model);

        expect(renderCallback).not.toHaveBeenCalled();
        instances[1].trigger('ready');
        expect(renderCallback).not.toHaveBeenCalled();
        instances[0].trigger('ready');
        expect(renderCallback).toHaveBeenCalled();

      });

      it('renders module and uses renderOptions function', function () {

        var Module = Controller.extend({
          render: jasmine.createSpy()
        });

        var model = new Model({
          modules: [
            {
              controller: Module,
              metadata: 'foo'
            }
          ]
        });

        var controller = new Controller(),
            renderOptionsSpy = jasmine.createSpy('renderOptionsSpy');

        renderOptionsSpy.andReturn({ foo: 'bar' });

        var instances = controller.renderModules(
          model.get('modules'),
          model,
          {},
          renderOptionsSpy,
          function () { }
        );

        expect(instances[0] instanceof Module).toBe(true);
        expect(renderOptionsSpy).toHaveBeenCalled();
        expect(renderOptionsSpy.mostRecentCall.args[0].get('metadata')).toBe('foo');
        expect(instances[0].render).toHaveBeenCalled();
        expect(instances[0].render).toHaveBeenCalledWith({ foo: 'bar' });

      });

    });

    describe('render', function () {

      var model;
      beforeEach(function () {
        model = new Model({
          'data-source': {
            'data-type': 'foo-type',
            'data-group': 'bar-group'
          }
        });
        spyOn(Controller.prototype, 'renderView');
        spyOn(Collection.prototype, 'fetch');
      });

      it('waits for collection data to be available and then renders view', function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection
        });
        controller.render();

        expect(controller.renderView).not.toHaveBeenCalled();
        expect(controller.collection instanceof Collection).toBe(true);
        expect(controller.collection.options.dataSource['data-type']).toEqual('foo-type');
        expect(controller.collection.options.dataSource['data-group']).toEqual('bar-group');
        expect(controller.collection.fetch).toHaveBeenCalled();

        controller.collection.trigger('reset');
        expect(controller.renderView).toHaveBeenCalled();
      });

      it('waits for collection data and renders view on error', function () {
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
        expect(controller.collection.options.dataSource['data-type']).toEqual('foo-type');
        expect(controller.collection.options.dataSource['data-group']).toEqual('bar-group');
        expect(controller.collection.options.foo).toEqual('bar');
        expect(controller.collection.fetch).toHaveBeenCalled();

        controller.collection.trigger('error');
        expect(controller.renderView).toHaveBeenCalled();
      });

      it('immediately renders the view when there is no collection', function () {
        var controller = new Controller({
          model: model,
          viewClass: View
        });
        controller.render();
        expect(controller.collection).not.toBeDefined();
        expect(controller.renderView).toHaveBeenCalled();
      });

      it('merges renderView options with render options', function () {
        var controller = new Controller({
          model: model,
          viewClass: View
        });
        controller.render({ foo: 'bar' });
        expect(controller.renderView).toHaveBeenCalledWith({
          model: model,
          foo: 'bar'
        });
      });

      it('render view on init on the server', function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection
        });
        controller.render();
        expect(controller.renderView).not.toHaveBeenCalled();
        controller.collection.trigger('reset');
        expect(controller.renderView).toHaveBeenCalled();
      });

      it('renders view on init on the client when configured', function () {
        jasmine.clientOnly(function () {
          var controller = new Controller({
            model: model,
            viewClass: View,
            collectionClass: Collection,
            clientRenderOnInit: true
          });
          controller.render();
          expect(controller.renderView).not.toHaveBeenCalled();
          controller.collection.trigger('reset');
          expect(controller.renderView).toHaveBeenCalled();
        });
      });

      it('sets collection data if it is defined', function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection,
          clientRenderOnInit: true
        });
        spyOn(controller, 'collectionData').andReturn([
          { value: 1 },
          { value: 2 }
        ]);
        controller.render();
        expect(controller.collection.length).toEqual(2);
        expect(controller.collection.at(0).toJSON()).toEqual({ value: 1 });
        expect(controller.collection.at(1).toJSON()).toEqual({ value: 2 });
      });

      it('renders view immediately if data is defined', function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection,
          clientRenderOnInit: true
        });
        spyOn(controller, 'collectionData').andReturn([
          { value: 1 },
          { value: 2 }
        ]);
        controller.render();
        expect(controller.renderView).toHaveBeenCalled();
      });

      it('does not fetch collection data if it is defined', function () {
        var controller = new Controller({
          model: model,
          viewClass: View,
          collectionClass: Collection,
          clientRenderOnInit: true
        });
        spyOn(controller, 'collectionData').andReturn([
          { value: 1 },
          { value: 2 }
        ]);
        controller.render();
        expect(Collection.prototype.fetch).not.toHaveBeenCalled();
      });

    });

    describe('renderView', function () {

      var controller, model;
      beforeEach(function () {
        spyOn(View.prototype, 'render');
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

      it('instantiates the view class and renders the content', function () {
        controller.renderView();
        expect(controller.html).toEqual('<div>content</div>');
        expect(controller.view.foo).toEqual('bar');
      });

      it('triggers a "ready" event asynchronously', function () {
        jasmine.Clock.useMock();
        var triggered = false;
        controller.once('ready', function () {
          triggered = true;
        });
        controller.renderView();
        expect(triggered).toBe(false);
        jasmine.Clock.tick(1);
        expect(triggered).toBe(true);
      });
    });
  });
});
