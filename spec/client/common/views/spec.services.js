define([
  'client/views/services',
  'backbone'
], function (ServicesView, Backbone) {

  describe('Services View', function () {

    var $el;

    beforeEach(function () {

      $el = $('<div><input id="filter"/></div>');

    });

    it('sets filter on model on initialisation if field value is set', function () {

      $el.find('#filter').val('foo');

      var view = new ServicesView({
        el: $el,
        model: new Backbone.Model()
      });

      expect(view.model.get('filter')).toEqual('foo');

    });

  });

});