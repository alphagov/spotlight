var requirejs = require('requirejs');
var $ = require('jquery');

var ModuleView = require('../../../app/server/views/module');

var Collection = requirejs('extensions/collections/collection');
var Model = requirejs('extensions/models/model');
var View = requirejs('extensions/views/view');

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
      slug: 'slug',
      parent: new Model({
        'page-type': 'dashboard'
      })
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
    expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading"><a href="/foo/bar">A Title</a></h2><div class="visualisation"><div class="visualisation-inner">test content</div><div class="visualisation-moreinfo"></div></div></section>');
  });

  it('renders a module with description', function () {
    model.set('description', 'Module on a dashboard');
    moduleView.render();
    expect(moduleView.$('p').eq(0).text()).toEqual('Module on a dashboard');
  });

  it('renders a standalone module with description', function () {
    model.get('parent').set('page-type', 'module');
    model.set('description', 'Description');
    moduleView.render();
    expect(moduleView.$('p').eq(1).text()).toEqual('Description');
  });

  it('renders an unpublished warning on the module page', function () {
    model.get('parent').set('page-type', 'module');
    model.get('parent').set('published', false);
    moduleView.render();
    expect(moduleView.$('#unpublished-warning').length).toEqual(1);
  });

  it('renders a standalone module with download id', function () {
    model.get('parent').set('page-type', 'module');
    moduleView.render();
    expect(moduleView.$('aside.more-info.download #download').length).toEqual(1);
  });

  it('renders a standalone module with info links', function () {
    var info = ['<a href="https://example.com/">Info line 1</a> with trailing text', 'Info line 2'];
    model.get('parent').set('page-type', 'module');
    model.set('info', info);
    moduleView.render();
    expect(moduleView.$('aside.more-info.about ul li').length).toEqual(info.length);
    moduleView.$('aside.more-info.about ul li').each(function (i) {
      expect($(this).html()).toEqual(info[i]);
    });
  });

  it('renders a standalone module with json download link', function () {
    model.get('parent').set('page-type', 'module');
    moduleView.render();
    expect(moduleView.$('aside.more-info.download ul li').length).toEqual(1);
    expect(moduleView.$('aside.more-info.download ul li:eq(0) a').text()).toEqual('JSON');
  });

  it('renders a standalone module with png download link for svg modules', function () {
    model.get('parent').set('page-type', 'module');
    moduleView.requiresSvg = true;
    moduleView.render();
    expect(moduleView.$('aside.more-info.download ul li').length).toEqual(2);
    expect(moduleView.$('aside.more-info.download ul li:eq(1) a').attr('href')).toEqual('/foo/bar.png?selector=.visualisation-inner');
    expect(moduleView.$('aside.more-info.download ul li:eq(1) a').text()).toEqual('PNG');
  });

  it('renders a table when hasTable is true and there are axes on the collection', function () {
    moduleView.hasTable = true;
    var collectionWithAxes = new Collection({}, { 'axes': true });
    moduleView.collection = collectionWithAxes;
    moduleView.render();
    expect($(getContent()).find('.visualisation-table').length).toEqual(1);
    expect($(getContent()).find('.visualisation-table').hasClass('visuallyhidden')).toBe(true);
    expect($(getContent()).find('.visualisation-table table').length).toEqual(1);
  });

});
