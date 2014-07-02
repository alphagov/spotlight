define([
  'client/views/services',
  'backbone'
], function (ServicesView, Backbone) {

  describe('Services View', function () {

    var $el;

    beforeEach(function () {
      spyOn(window.history, 'replaceState');
      $el = $('<div><input id="filter"/><select id="department"><option value="">All</option><option value="home-office">Home Office</option></select></div>');
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

    it('uses the history API to update the URL after filtering', function () {
      $el.find('#filter').val('passport');
      var view = new ServicesView({
        el: $el,
        model: new Backbone.Model()
      });
      view.filter();
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '/performance/services?filter=passport&department=&agency=');
    });

  });

});
