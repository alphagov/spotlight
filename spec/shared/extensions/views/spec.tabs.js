define([
  'extensions/views/tabs',
  'extensions/collections/collection',
  'extensions/models/model'], 
function(Tabs, Collection, Model) {
  describe("Tabs", function() {
    describe("initialize", function() {
      it("should initialize with a model, target attribute and array of tabs", function() {
        var model = new Model();
        spyOn(model, 'on');
        var tab = new Tabs({
          model: model,
          attr: 'anAttribute',
          tabs: [{
            name: "Test",
            id: "test"
          }]
        });
        expect(model.on).toHaveBeenCalled();
      });
    });

    describe("rendering", function() {
      var tab, model;
      
      beforeEach(function () {
        model = new Model();
        model.set('anAttribute', 'foo');
        tab = new Tabs({
          model: model,
          attr: 'anAttribute',
          tabs: [{
            name: "Test",
            id: "test"
          },{
            name: "Foo",
            id: "foo"
          }]
        });
      });
      
      it("should render all tabs and marks the one the model id points to as active", function() {
        jasmine.renderView(tab, function () {
          expect(tab.$el.find('li').length).toBe(2);
          expect(tab.$el.find('li:eq(0)')).toHaveText("Test")
          expect(tab.$el.find('.active').length).toBe(1);
          expect(tab.$el.find('.active')).toHaveText("Foo");
        });
      });
      
      it("should update the active tab when the model is updated", function() {
        jasmine.renderView(tab, function () {
          expect(tab.$el.find('.active').length).toBe(1);
          expect(tab.$el.find('.active').text()).toBe("Foo");
          model.set('anAttribute', 'test');
          expect(tab.$el.find('.active').length).toBe(1);
          expect(tab.$el.find('.active').text()).toBe("Test");
        });
      });
    });
    
    describe("clicking on a tab", function () {
      var tab, model;
      
      beforeEach(function () {
        model = new Model();
        collection = new Collection();
        collection.options = {};
        spyOn(model, "set");
        tab = new Tabs({
          model: model,
          collection: collection,
          attr: 'anAttribute',
          tabs: [{
            name: "Test",
            id: "test"
          },{
            name: "Foo",
            id: "foo"
          }]
        });
      });
      
      
      it("should update the model and collection when a non-active tab is clicked on", function () {
        jasmine.renderView(tab, function () {
          tab.$el.find('li:eq(1)').trigger('click');
          expect(model.set).toHaveBeenCalledWith('anAttribute', 'foo');
          expect(collection.options.valueAttr).toEqual('foo');
        });
      });
            
    });
  });

});
