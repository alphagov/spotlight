define([
  'common/views/govuk',
  'extensions/views/view',
  'extensions/models/model'
],
function (GovUkView, View, Model) {
  describe("GovUkView", function () {
    it("renders a page with breadcrumbs and content view in GOV.UK style", function () {

      var TestView = View.extend({
        template: function () {
          return 'test_content';
        }
      });

      var model = new Model({
        requirePath: '/testRequirePath/',
        assetPath: '/testAssetPath/',
        environment: 'development'
      });

      var view = new GovUkView({
        model: model,
        bodyEndTemplate: function () {
          return 'body_end';
        },
        reportAProblemTemplate: function () {
          return "report_a_problem";
        }
      });

      spyOn(view, "template").andReturn('rendered')
      spyOn(view, "getContent").andReturn('test_content');

      view.render();

      expect(view.html).toEqual('rendered');

      var context = view.template.argsForCall[0][0];
      expect(context.head.trim().indexOf('<link href="&#x2F;testAssetPath&#x2F;stylesheets/spotlight.css" media="screen" rel="stylesheet" type="text/css">')).not.toBe(-1);
      expect(context.head.trim().indexOf('google-analytics.com')).not.toBe(-1);
      expect(context.bodyEnd).toEqual('body_end');
      expect(context.pageTitle).toEqual('Performance - GOV.UK');

      var content = context.content.replace(/\s+/g, ' ').trim();
      expect(content).toEqual('<div id="global-breadcrumb"> <ol class="group" role="breadcrumbs"> <li><a href="&#x2F;performance">Performance</a></li> </ol> </div> <div id="wrapper"> <section id="content" class="group"> <div class="performance-platform-outer"> test_content report_a_problem </div> </section> </div>');
    });
  });
});
