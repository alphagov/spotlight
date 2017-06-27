define([
  'client/views/json-summary',
  'extensions/models/model',
  'extensions/collections/collection',
  'jquery'
],
function (JsonSummary, Model, Collection, $) {
  describe('JsonSummary', function () {
    var view, $el, model, collection;

    collection =  new Collection();

    beforeEach(function () {
      $el = $('<li class="json-summary"></li>');
      $el.html('<a href="<jsonUrl>">JSON</a> | <a href="<csvUrl>">CSV</a>');
      view = new JsonSummary({
        el: $el,
        model: model,
        collection: collection
      });
    });

    describe('render', function () {
      it('should update element to add new url assigned', function () {
        spyOn(collection, 'url').andReturn('newUrl');
        var $oldEl = view.$el;
        view.render();
        expect($oldEl).not.toEqual(view.$el);
        expect(view.$el.attr('href')).toContain('newUrl');
      });

    });

  });
});

