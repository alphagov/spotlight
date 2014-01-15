define([
  'common/views/module_standalone',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/views/view'
],
function (StandaloneView, Collection, Model, View) {
  describe("StandaloneView", function () {

    var standaloneView, model, collection;
    beforeEach(function() {
      var Visualisation = View.extend({
        render: function () {
          this.$el.html('test content');
        }
      });
      model = new Model();
      collection = new Collection();
      standaloneView = new StandaloneView({
        visualisationClass: Visualisation,
        className: 'testclass',
        collection: collection,
        model: model
      });
    });

    describe("getContent", function () {
      it("renders a module", function () {
        var content = standaloneView.getContent();
        expect(content).toContain('class="testclass"');
        expect(content).toContain('<div class="visualisation">test content</div>');
      });

      it("renders a module with a fallback element", function () {
        jasmine.serverOnly(function () {
          var Visualisation = View.extend({
            render: function () {
              this.$el.html('test content');
            }
          });
          var model = new Model();
          var collection = new Collection();
          var standaloneView = new StandaloneView({
            visualisationClass: Visualisation,
            className: 'testclass',
            requiresSvg: true,
            url: '/testurl',
            collection: collection,
            model: model
          });

          var content = standaloneView.getContent();
          content = content.replace(/>\s+?</g, '><');
          expect(content).toContain('class="testclass"');
          expect(content).toContain('<div class="visualisation-fallback" data-src="/testurl.png"><noscript><img src="/testurl.png" /></noscript></div>');
        });
      });

      it("renders h1 and h2 elements as required for accessibility", function () {
        jasmine.serverOnly(function () {
          var Visualisation = View.extend({
            render: function () {
              this.$el.html('test content');
            }
          });
          var model = new Model();
          model.set('page-type', 'module');
          model.set('description', 'my description')
          var collection = new Collection();
          var standaloneView = new StandaloneView({
            visualisationClass: Visualisation,
            className: 'testclass',
            requiresSvg: true,
            url: '/testurl',
            collection: collection,
            model: model
          });

          var content = standaloneView.getContent();
          content = content.replace(/>\s+?</g, '><');
          expect(content).toContain('<h1 id="undefined-heading"></h1>');
          expect(content).toContain('<h2 class="dashboard">my description</h2>');
        });
      });

    });

    describe("getPageTitle", function () {
      it("calculates page title from title and dashboard information", function () {
        model.set({
          title: 'Title',
          'dashboard-title': 'Dashboard',
          'dashboard-strapline': 'Strapline'
        });
        expect(standaloneView.getPageTitle()).toEqual('Title - Dashboard - Strapline - GOV.UK');
      });

      it("calculates page title from title alone", function () {
        model.set({
          title: 'Title'
        });
        expect(standaloneView.getPageTitle()).toEqual('Title - Performance - GOV.UK');
      });
    });

    describe("Standalone module breadcrumbs", function () {
      it("adds the parent dashboard as a crumb when Stagecraft returns the necessary properties", function () {
        model.set({
          'dashboard-title': 'Parent dashboard',
          'dashboard-slug': 'parent-dashboard'
        });
        expect(standaloneView.getBreadcrumbCrumbs()).toEqual([
          {path: '/performance', title: 'Performance'},
          {path: '/performance/parent-dashboard', title: 'Parent dashboard'}
        ]);
      });

      it("leaves just a PP crumb when Stagecraft doesn't return enough data", function () {
        model.set({
          'dashboard-title': 'Parent dashboard without a slug',
        });
        expect(standaloneView.getBreadcrumbCrumbs()).toEqual([{path: '/performance', title: 'Performance'}]);
      });
    });
  });
});
