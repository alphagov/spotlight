define([
  'extensions/views/view',
  'stache!common/templates/head',
  'tpl!common/templates/body-end.html',
  'stache!common/templates/navigation',
  'stache!common/templates/govuk_template',
  'stache!common/templates/footer_top',
  'stache!common/templates/footer_links',
  'stache!common/templates/report_a_problem',
  'stache!common/templates/content'
],
function (View, headTemplate, bodyEndTemplate, navigationTemplate,
          govukTemplate, footerTopTemplate, footerLinksTemplate,
          reportAProblemTemplate, contentTemplate) {
  /**
   * Renders a page in GOV.UK style using govuk_template.
   * Does not use jsdom itself but renders template directly because jsdom
   * does not seem to play nicely with <script> tags.
   */
  var GovUkView = View.extend({
    template: govukTemplate,
    bodyEndTemplate: bodyEndTemplate,
    reportAProblemTemplate: reportAProblemTemplate,

    getContent: function () {
      return '';
    },

    render: function () {
      var context = this.templateContext();
      this.html = this.template(context);
    },

    getPageTitleItems: function () {
      return [];
    },

    getPageTitle: function () {
      var items = this.getPageTitleItems().filter(function (el) {
        return el != null;
      });
      if (items.length <= 1) {
        items.push('Performance');
      }
      items.push('GOV.UK');
      return items.join(' - ');
    },

    templateContext: function () {
      var baseContext = this.model.toJSON();
      baseContext.model = this.model;

      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        baseContext,
        {
          head: headTemplate(baseContext),
          bodyEnd: this.bodyEndTemplate(baseContext),
          topOfPage: "",
          pageTitle: this.getPageTitle(),
          bodyClasses: "",
          insideHeader: navigationTemplate,
          cookieMessage: "",
          footerTop: footerTopTemplate(),
          footerSupportLinks: footerLinksTemplate(),
          content: contentTemplate({
            content: this.getContent(),
            reportAProblem: this.reportAProblemTemplate(baseContext) 
          })
        }
      );
    }    

  });

  return GovUkView;
});
