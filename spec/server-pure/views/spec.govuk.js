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

  it('renders a page with content view in GOV.UK style', function () {

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
    expect(content).toEqual('<ol class="group"> <li> <a href="/performance"> <span title="Performance"> Performance </span> </a> </li> </ol> <div id="wrapper"> <main id="content" class="group" role="main"> test_content report_a_problem </main> </div>');
  });

});
