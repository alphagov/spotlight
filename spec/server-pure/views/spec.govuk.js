var requirejs = require('requirejs');

var GovUkView = require('../../../app/server/views/govuk');

var Model = requirejs('extensions/models/model');

describe('GovUkView', function () {

  var model;
  beforeEach(function () {
    model = new Model({
      requirePath: '/testRequirePath/',
      assetPath: '/testAssetPath/',
      assetDigest: {
        'spotlight.css': 'spotlight-cachebust.css'
      },
      environment: 'development'
    });
  });

  it('renders a page with breadcrumbs and content view in GOV.UK style', function () {

    var view = new GovUkView({
      model: model
    });

    spyOn(view, 'loadTemplate').andCallThrough();
    spyOn(view, 'getContent').andReturn('test_content');
    spyOn(view, 'getReportForm').andReturn('report_a_problem');

    view.render();

    var context = view.loadTemplate.mostRecentCall.args[1];
    expect(context.head.trim().indexOf('<link href="/testAssetPath/stylesheets/spotlight-cachebust.css" media="all" rel="stylesheet" type="text/css">')).not.toBe(-1);
    expect(context.head.trim().indexOf('google-analytics.com')).not.toBe(-1);
    expect(context.pageTitle).toEqual('Performance - GOV.UK');

    var content = context.content.replace(/\s+/g, ' ').trim();
    expect(content).toEqual('<div id="global-breadcrumb"> <ol class="group"> <li> <a href="/performance"> <span title="Performance"> Performance </span> </a> </li> </ol> </div> <main id="content" class="group" role="main"> test_content report_a_problem </main>');
  });

  it('doesn\'t display the breadcrumb wrapper if there are no breadcrumbs', function () {
    var view = new GovUkView({
      model: model,
    });

    spyOn(view, 'loadTemplate').andCallThrough();
    spyOn(view, 'getBreadcrumbCrumbs').andReturn([]);

    view.render();

    var context = view.loadTemplate.mostRecentCall.args[1];
    var content = context.content.replace(/\s+/g, ' ').trim();

    expect(content.indexOf('breadcrumb')).toEqual(-1);
  });

  it('adds ellipses to very long breadcrumbs', function () {
    var ellipsisView = new GovUkView({
      model: model,
    });

    spyOn(ellipsisView, 'loadTemplate').andCallThrough();
    spyOn(ellipsisView, 'getBreadcrumbCrumbs').andReturn([
      {'path': '/performance', 'title': 'Performance'},
      {'path': '/url', 'title': 'A very very very very very very very long department name'}
    ]);

    ellipsisView.render();

    var context = ellipsisView.loadTemplate.mostRecentCall.args[1];
    var content = context.content.replace(/\s+/g, ' ').trim();

    expect(content).toContain('A very very very very very very …');
  });

});
