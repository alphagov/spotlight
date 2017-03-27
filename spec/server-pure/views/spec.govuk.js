var requirejs = require('requirejs');

var GovUkView = require('../../../app/server/views/govuk');

var Model = requirejs('extensions/models/model');

describe('GovUkView', function () {

  it('renders a page with content view in GOV.UK style', function () {
    var model = new Model({
      requirePath: '/testRequirePath/',
      assetPath: '/testAssetPath/',
      assetDigest: {
        'spotlight.css': 'spotlight-cachebust.css'
      },
      environment: 'development'
    });

    var view = new GovUkView({
      model: model
    });

    spyOn(view, 'loadTemplate').andCallThrough();
    spyOn(view, 'getContent').andReturn('test_content');
    spyOn(view, 'getReportForm').andReturn('report_a_problem');

    view.render();

    var context = view.loadTemplate.mostRecentCall.args[1];
    expect(context.head.trim().indexOf('<link href="/testAssetPath/stylesheets/spotlight-cachebust.css" media="all" rel="stylesheet" type="text/css">')).not.toBe(-1);
    expect(context.pageTitle).toEqual('Performance - GOV.UK');

    var content = context.content.replace(/\s+/g, ' ').trim();
    expect(content).toEqual('<div id="wrapper"> <main id="content" class="group" role="main"> test_content report_a_problem </main> </div>');
  });

  it('escapes values that are reflected into the page', function () {
    var original = '\'";<script>';

    var model = new Model({
      requirePath: '/testRequirePath/',
      assetPath: '/testAssetPath/',
      assetDigest: {
        'spotlight.css': 'spotlight-cachebust.css'
      },
      environment: 'development',
      params: {
        sortby: original
      }
    });

    var view = new GovUkView({
      model: model
    });

    spyOn(view, 'loadTemplate').andCallThrough();
    spyOn(view, 'getContent').andReturn('test_content');
    spyOn(view, 'getReportForm').andReturn('report_a_problem');

    view.render();

    // Check the context of the render call for bodyEnd
    // and inspect the serializedModel JSON string
    var calls = view.loadTemplate.calls;
    var bodyEndCall = calls[1];
    var context = bodyEndCall.args[1];
    var serialized = context.serializedModel;

    // Ensure the params string is fully escaped.
    expect(serialized).toMatch(/sortby":"'\\";\\u003Cscript\\u003E/);
  });

});
