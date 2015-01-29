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

    it('uses the history API to update the URL after filtering', function () {
      $el.find('#filter').val('passport');
      var view = new ServicesView({
        el: $el,
        model: new Backbone.Model()
      });
      view.filter();
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?filter=passport');
      $el.find('#department').val('home-office');
      view.filter();
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?filter=passport&department=home-office');
    });

  });

});
