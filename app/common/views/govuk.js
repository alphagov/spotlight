define([
  'common/views/raw',
  'stache!common/templates/govuk_template',
  'stache!common/templates/content'
],
function (RawView, govukTemplate, contentTemplate) {
  /**
   * Renders a page in GOV.UK style using govuk_template.
   * Does not use jsdom itself but renders template directly because jsdom
   * does not seem to play nicely with <script> tags.
   */
  var GovUkView = RawView.extend({
    template: govukTemplate,

    render: function () {
      var context = this.templateContext();
      var content = this.content = new (this.model.get('view'))({
        model: this.model
      });
      content.render();
      context.content = contentTemplate({
        content: this.content.$el.html()
      });
      this.html = this.template(context);
    }

  });

  return GovUkView;
});
