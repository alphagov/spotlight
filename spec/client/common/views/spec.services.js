define([
  'client/views/services',
  'backbone'
], function (ServicesView, Backbone) {

  describe('Services View', function () {

    var $el;

    beforeEach(function () {
      $el = $('<div><input id="filter"/><select id="department"><option value="home-office">Home Office</option></select></div>');
    });

    it('sets filter on model on initialisation if field value is set', function () {
      $el.find('#filter').val('foo');
      var view = new ServicesView({
        el: $el,
        model: new Backbone.Model()
      });

      expect(view.model.get('filter')).toEqual('foo');
    });

    it('sets department filter on the model on initialisation if applicable', function () {
      $el.find('#department').val('home-office');
      var view = new ServicesView({
        el: $el,
        model: new Backbone.Model()
      });

      expect(view.model.get('departmentFilter')).toEqual('home-office');
    });

  });

});
