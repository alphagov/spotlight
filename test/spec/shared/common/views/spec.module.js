define([
  'common/views/module',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/views/view'
],
function (ModuleView, Collection, Model, View) {
  describe("ModuleView", function () {

    var moduleView, model;

    var getContent = function () {
      return moduleView.$el[0].outerHTML.replace(/>\s+?</g, '><');
    };

    beforeEach(function() {
      var Visualisation = View.extend({
        render: function () {
          this.$el.html('test content');
        }
      });
      model = new Model({
        title: 'Title'
      });
      var collection = new Collection();
      moduleView = new ModuleView({
        visualisationClass: Visualisation,
        className: 'testclass',
        collection: collection,
        model: model
      });
    });

    it("renders a module", function () {
      moduleView.render();
      expect(getContent()).toEqual('<section class="testclass"><h1>Title</h1><div class="visualisation">test content</div></section>');
    });

    it("renders a module with description", function () {
      model.set('description', 'Description');
      moduleView.render();
      expect(getContent()).toEqual('<section class="testclass"><h1>Title</h1><h2>Description</h2><div class="visualisation">test content</div></section>');
    });

    it("renders a module with description and info", function () {
      model.set('description', 'Description');
      model.set('info', ['Info line 1', 'Info line 2']);
      moduleView.render();
      expect(getContent()).toEqual('<section class="testclass"><h1>Title</h1><aside class="more-info"><span class="more-info-link">more info</span><ul><li>Info line 1</li><li>Info line 2</li></ul></aside><h2>Description</h2><div class="visualisation">test content</div></section>');
    });

    it("renders an SVG-based module as a fallback element on the server", function () {
      jasmine.serverOnly(function () {
        moduleView.requiresSvg = true;
        moduleView.url = '/test/url';
        moduleView.render();

        // normalise jsdom and phantomjs output
        var content = getContent()
          .replace('&lt;', '<')
          .replace('&gt;', '>')
          .replace(' />', '/>');

        expect(content).toEqual('<section class="testclass"><h1>Title</h1><div class="visualisation-fallback" data-src="/test/url.png?raw"><noscript><img src="/test/url.png?raw"/></noscript></div></section>');
      });
    });

    it("renders an SVG-based module as normal on the client", function () {
      jasmine.clientOnly(function () {
        moduleView.requiresSvg = true;
        moduleView.render();
        expect(getContent()).toEqual('<section class="testclass"><h1>Title</h1><div class="visualisation">test content</div></section>');
      });
    });
  });
});
