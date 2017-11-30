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
      $el.html('<a href="url&format=json">JSON</a>');
      view = new JsonSummary({
        el: $el,
        model: model,
        collection: collection
      });
    });

    describe('render', function () {
      it('should update element to add new url assigned', function () {
        spyOn(collection, 'url').and.returnValue('newUrl');
        view.render();
        expect(view.$el.prop('tagName')).toEqual('LI');
        var $links = view.$el.find('a');

        expect($links.length).toEqual(1);
        expect($links.first().attr('href')).toEqual('newUrl&format=json');
      });

    });

  });
});

