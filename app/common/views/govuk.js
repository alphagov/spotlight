define([
  'extensions/views/view',
  'stache!common/templates/govuk_template',
  'stache!common/templates/content',
  'stache!common/templates/head',
  'stache!common/templates/body-end'
],
function (View, govukTemplate, contentTemplate, headTemplate, bodyEndTemplate) {
  /**
   * Renders a page in GOV.UK style using govuk_template.
   * Does not use jsdom itself but renders template directly because jsdom
   * does not seem to play nicely with <script> tags.
   */
  var GovUkView = View.extend({
    template: govukTemplate,

    render: function () {
      var context = this.templateContext();
      var content = this.content = new (this.model.get('view'))({
        model: this.model
      });
      content.once('postrender', function () {
        context.content = contentTemplate({
          content: this.content.$el.html()
        });
        this.html = this.template(context);
        this.trigger('postrender');
      }, this);
      content.render();
    },

    templateContext: function () {
      var baseContext = {
        requirePath: this.requirePath,
        assetPath: this.assetPath,
        development: this.environment === 'development'
      };

      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        baseContext,
        {
          head: headTemplate(baseContext),
          bodyEnd: bodyEndTemplate(baseContext),
          topOfPage: "",
          pageTitle: "",
          bodyClasses: "",
          insideHeader: "",
          cookieMessage: "",
          footerTop: "",
          footerSupportLinks: ""
        }
      );
    }

  });

  return GovUkView;
});
