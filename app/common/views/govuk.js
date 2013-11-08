define([
  'extensions/views/view',
  'stache!common/templates/head',
  'tpl!common/templates/body-end.html',
  'stache!common/templates/govuk_template',
  'stache!common/templates/content'
],
function (View, headTemplate, bodyEndTemplate, govukTemplate, contentTemplate) {
  /**
   * Renders a page in GOV.UK style using govuk_template.
   * Does not use jsdom itself but renders template directly because jsdom
   * does not seem to play nicely with <script> tags.
   */
  var GovUkView = View.extend({
    template: govukTemplate,
    bodyEndTemplate: bodyEndTemplate,

    getContent: function () {
      return '';
    },

    render: function () {
      var context = this.templateContext();
      this.html = this.template(context);
    },

    templateContext: function () {
      var baseContext = {
        model: this.model,
        requirePath: this.model.get('requirePath'),
        assetPath: this.model.get('assetPath'),
        development: this.model.get('environment') === 'development'
      };

      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        baseContext,
        {
          head: headTemplate(baseContext),
          bodyEnd: this.bodyEndTemplate(baseContext),
          topOfPage: "",
          pageTitle: "",
          bodyClasses: "",
          insideHeader: "",
          cookieMessage: "",
          footerTop: "",
          footerSupportLinks: "",
          content: contentTemplate({
            content: this.getContent()
          })
        }
      );
    }    

  });

  return GovUkView;
});
