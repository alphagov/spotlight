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
      model: model,
      bodyEndTemplate: function () {
        return 'body_end';
      },
      reportAProblemTemplate: function () {
        return 'report_a_problem';
      }
    });

    spyOn(view, 'template').andReturn('rendered');
    spyOn(view, 'getContent').andReturn('test_content');

    view.render();

    expect(view.html).toEqual('rendered');

    var context = view.template.argsForCall[0][0];
    expect(context.head.trim().indexOf('<link href="/testAssetPath/stylesheets/spotlight-cachebust.css" media="all" rel="stylesheet" type="text/css">')).not.toBe(-1);
    expect(context.head.trim().indexOf('google-analytics.com')).not.toBe(-1);
    expect(context.bodyEnd).toEqual('body_end');
    expect(context.pageTitle).toEqual('Performance - GOV.UK');

    var content = context.content.replace(/\s+/g, ' ').trim();
    expect(content).toEqual('<div id="global-breadcrumb"> <ol class="group" role="breadcrumbs"> <li> <a href="/performance"> <span title="Performance"> Performance </span> </a> </li> </ol> </div> <div id="wrapper"> <main id="content" class="group" role="main"> <div class="performance-platform-outer"> test_content report_a_problem </div> </main> </div>');
  });

  it('doesn\'t display the breadcrumb wrapper if there are no breadcrumbs', function () {
    var view = new GovUkView({
      model: model,
    });

    spyOn(view, 'template').andReturn('rendered');
    spyOn(view, 'getBreadcrumbCrumbs').andReturn([]);

    view.render();

    var context = view.template.argsForCall[0][0];
    var content = context.content.replace(/\s+/g, ' ').trim();

    expect(content.indexOf('breadcrumb')).toEqual(-1);
  });

  it('adds ellipses to very long breadcrumbs', function () {
    var ellipsisView = new GovUkView({
      model: model,
    });

    spyOn(ellipsisView, 'template').andReturn('rendered');
    spyOn(ellipsisView, 'getBreadcrumbCrumbs').andReturn([
      {'path': '/performance', 'title': 'Performance'},
      {'path': '/url', 'title': 'A very very very very very very very long department name'}
    ]);

    ellipsisView.render();

    var context = ellipsisView.template.argsForCall[0][0];
    var content = context.content.replace(/\s+/g, ' ').trim();

    expect(content).toContain('A very very very very very very …');
  });

});
