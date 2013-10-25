define([
  'common/views/govuk',
  'extensions/models/model',
  'extensions/views/view'
],
function (GovUkView, Model, View) {
  describe("GovUkView", function () {
    it("renders a page with a content view in GOV.UK style", function () {

      var TestView = View.extend({
        template: function () {
          return 'test_content';
        }
      });

      var model = new Model({
        view: TestView
      });

      var view = new GovUkView({
        requirePath: '/testRequirePath/',
        assetPath: '/testAssetPath/',
        environment: 'development',
        model: model
      });

      spyOn(view, "template").andReturn('rendered')

      view.render();

      expect(view.html).toEqual('rendered');

      expect(view.content.model).toBe(model);

      var context = view.template.argsForCall[0][0];
      expect(context.head.trim()).toEqual('<link href="&#x2F;testAssetPath&#x2F;stylesheets/spotlight.css" media="screen" rel="stylesheet" type="text/css">');
      expect(context.bodyEnd.trim()).toEqual('<script data-main="&#x2F;testRequirePath&#x2F;client.js" src="&#x2F;testRequirePath&#x2F;vendor/require.js" type="text/javascript"></script>');

      var content = context.content.replace(/\s+/g, ' ').trim();
      expect(content).toEqual('<section id="content"> <div class="performance-platform-outer"> test_content </div> </section>');
    });
  });
});
