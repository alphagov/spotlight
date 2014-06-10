define([
  'common/views/module',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/views/view',
  'jquery'
],
function (ModuleView, Collection, Model, View, $) {
  describe('ModuleView', function () {

    var moduleView, model;

    var getContent = function () {
      return moduleView.$el[0].outerHTML.replace(/>\s+?</g, '><');
    };

    beforeEach(function () {
      var Visualisation = View.extend({
        render: function () {
          this.$el.html('test content');
        }
      });
      model = new Model({
        title: 'A Title',
        slug: 'slug'
      });
      var collection = new Collection();
      moduleView = new ModuleView({
        visualisationClass: Visualisation,
        className: 'testclass',
        collection: collection,
        model: model,
        url: '/foo/bar'
      });
    });

    afterEach(function () {
      moduleView.remove();
    });

    it('renders a module', function () {
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><div class="visualisation"><div class="visualisation-inner">test content</div><div class="visualisation-moreinfo"></div></div></section>');
    });

    it('renders a module with description', function () {
      model.set('description', 'Description');
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><h3>Description</h3><div class="visualisation"><div class="visualisation-inner">test content</div><div class="visualisation-moreinfo"></div></div></section>');
    });

    it('renders a module with description', function () {
      model.set('description', 'Description');
      model.set('parent', new Model({
        slug: 'parentSlug'
      }));
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading"><a href="parentSlug/slug">A Title</a></h2><h3>Description</h3><div class="visualisation"><div class="visualisation-inner">test content</div><div class="visualisation-moreinfo"></div></div></section>');
    });

    it('renders a module with description and info', function () {
      model.set('description', 'Description');
      model.set('info', ['Info line 1', 'Info line 2']);
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><h3>Description</h3><div class="visualisation"><div class="visualisation-inner">test content</div><div class="visualisation-moreinfo"></div></div></section>');
    });

    it('renders a module with description and info link', function () {
      model.set('description', 'Description');
      model.set('info', ['<a href="https://example.com/">Info line 1</a> with trailing text', 'Info line 2']);
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><h3>Description</h3><div class="visualisation"><div class="visualisation-inner">test content</div><div class="visualisation-moreinfo"></div></div></section>');
    });

    it('renders a standalone module with description', function () {
      model.set('page-type', 'module');
      model.set('description', 'Description');
      moduleView.render();
      expect(moduleView.$('h2.dashboard').text()).toEqual('Description');
    });

    it('renders a standalone module with info links', function () {
      var info = ['<a href="https://example.com/">Info line 1</a> with trailing text', 'Info line 2'];
      model.set('page-type', 'module');
      model.set('info', info);
      moduleView.render();
      expect(moduleView.$('aside.more-info.about ul li').length).toEqual(info.length);
      moduleView.$('aside.more-info.about ul li').each(function (i) {
        expect($(this).html()).toEqual(info[i]);
      });
    });

    it('renders a standalone module with json download link', function () {
      model.set('page-type', 'module');
      moduleView.render();
      expect(moduleView.$('aside.more-info.download ul li').length).toEqual(1);
      expect(moduleView.$('aside.more-info.download ul li:eq(0) a').text()).toEqual('JSON');
    });

    it('renders a standalone module with png download link for svg modules', function () {
      model.set('page-type', 'module');
      moduleView.requiresSvg = true;
      moduleView.render();
      expect(moduleView.$('aside.more-info.download ul li').length).toEqual(2);
      expect(moduleView.$('aside.more-info.download ul li:eq(1) a').attr('href')).toEqual('/foo/bar.png');
      expect(moduleView.$('aside.more-info.download ul li:eq(1) a').text()).toEqual('PNG');
    });

    it('renders an SVG-based module as a fallback element on the server', function () {
      jasmine.serverOnly(function () {
        moduleView.requiresSvg = true;
        moduleView.render();

        // normalise jsdom and phantomjs output
        var content = getContent()
          .replace('&lt;', '<')
          .replace('&gt;', '>')
          .replace(' />', '/>');

        expect(content).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><div class="visualisation"><div class="visualisation-inner" data-src="/foo/bar.png"><noscript><img src="/foo/bar.png"/></noscript></div><div class="visualisation-moreinfo"></div></div></section>');
      });
    });

    it('renders an SVG-based module as normal on the client', function () {
      jasmine.clientOnly(function () {
        moduleView.requiresSvg = true;
        moduleView.render();
        expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><div class="visualisation"><div class="visualisation-inner" data-src="/foo/bar.png">test content</div><div class="visualisation-moreinfo"></div></div></section>');
      });
    });

    it('renders a table when hasTable is true and there are axes on the collection', function () {
      moduleView.hasTable = true;
      var collectionWithAxes = new Collection({}, { 'axes': true });
      moduleView.collection = collectionWithAxes;
      moduleView.render();
      expect($(getContent()).find('table.visuallyhidden').html()).toEqual('<thead><tr></tr></thead><tbody><tr></tr></tbody>');
    });

  });
});
