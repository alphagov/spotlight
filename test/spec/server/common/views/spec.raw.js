define([
  'common/views/module_raw',
  'extensions/models/model',
  'stache!common/templates/raw_template',
  'stache!common/templates/govuk_template',
  'extensions/views/view'
],
function (RawView, Model, rawTemplate, govukTemplate, View) {
  describe("RawView", function () {
    it("renders a page with content only", function (done) {

      var TestView = View.extend({
        template: function () {
          return 'test_content';
        }
      });

      var model = new Model({
        view: TestView
      });

      var view = new RawView({
        requirePath: '/testRequirePath/',
        assetPath: '/testAssetPath/',
        environment: 'development',
        model: model
      });

      expect(view.template()).toEqual(rawTemplate());
      expect(view.template()).not.toEqual(govukTemplate());
      spyOn(view, "template").andReturn('rendered');

      view.on('postrender', function () {
        expect(view.html).toEqual('rendered');

        expect(view.content.model).toBe(model);

        var context = view.template.argsForCall[0][0];
        expect(context.head.trim()).toEqual('<link href="&#x2F;testAssetPath&#x2F;stylesheets/spotlight.css" media="screen" rel="stylesheet" type="text/css">');
        expect(context.bodyEnd.trim()).toEqual('<script data-main="&#x2F;testRequirePath&#x2F;client.js" src="&#x2F;testRequirePath&#x2F;vendor/require.js" type="text/javascript"></script>');

        var content = context.content.replace(/\s+/g, ' ').trim();
        expect(content).toEqual('test_content');
        done();
      });

      view.render();
    });
  });
});
