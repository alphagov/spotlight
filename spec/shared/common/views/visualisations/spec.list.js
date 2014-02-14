define([
  'common/views/visualisations/list',
  'extensions/collections/collection'
],
function (ListView, Collection) {

  describe("ListView", function() {

    it("should show the correct number of items", function() {

      var collection = new Collection([
        { "pageTitle": "foo",
          "pagePath": "/foo" },
        { "pageTitle": "bar",
          "pagePath": "/bar" }
      ], { 
        "label-attr": "pageTitle",
        "link-attr": "pagePath"
      });

      view = new ListView({
        collection: collection
      });

      var foo = jasmine.renderView(view, function() {
        var listItems = view.$el.find('li');

        expect(listItems.length).toEqual(2);
        expect(listItems.first().text().trim()).toEqual('foo');
        expect(listItems.first().find('a').attr('href')).toEqual('/foo');
        expect(listItems.last().text().trim()).toEqual('bar');
        expect(listItems.last().find('a').attr('href')).toEqual('/bar');
      });

    });

    it("should show the urls with a url-root", function() {

      var collection = new Collection([
        { "pageTitle": "foo",
          "pagePath": "/foo" },
        { "pageTitle": "bar",
          "pagePath": "/bar" }
      ], { 
        "label-attr": "pageTitle",
        "link-attr": "pagePath",
        "url-root": "https://www.gov.uk"
      });

      view = new ListView({
        collection: collection
      });

      var foo = jasmine.renderView(view, function() {
        var listItems = view.$el.find('li');

        expect(view.$el.find('li a').first().attr('href')).toEqual('https://www.gov.uk/foo');
      });

    });

    it("should not show links if there is no link-attr", function() {

      var collection = new Collection([
        { "pageTitle": "foo",
          "pagePath": "/foo" },
        { "pageTitle": "bar",
          "pagePath": "/bar" }
      ], { 
        "label-attr": "pageTitle"
      });

      view = new ListView({
        collection: collection
      });

      var foo = jasmine.renderView(view, function() {
        var listItems = view.$el.find('li');

        expect(listItems.length).toEqual(2);
        expect(listItems.find('a').length).toEqual(0);
      });

    });

  });

});
