var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');

var headTemplate = requirejs('tpl!common/templates/head.html');
var bodyEndTemplate = requirejs('tpl!common/templates/body-end.html');
var navigationTemplate = requirejs('stache!common/templates/navigation');
var breadcrumbsTemplate = requirejs('stache!common/templates/breadcrumbs');
var govukTemplate = requirejs('stache!common/templates/govuk_template');
var footerTopTemplate = requirejs('stache!common/templates/footer_top');
var footerLinksTemplate = requirejs('stache!common/templates/footer_links');
var reportAProblemTemplate = requirejs('stache!common/templates/report_a_problem');
var cookieMessageTemplate = requirejs('stache!common/templates/cookie_message_template');
var contentTemplate = requirejs('stache!common/templates/content');


/**
 * Renders a page in GOV.UK style using govuk_template.
 * Does not use jsdom itself but renders template directly because jsdom
 * does not seem to play nicely with <script> tags.
 */
module.exports = View.extend({
  template: govukTemplate,
  bodyEndTemplate: bodyEndTemplate,
  reportAProblemTemplate: reportAProblemTemplate,
  breadcrumbsTemplate: breadcrumbsTemplate,

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
      return _.isString(el);
    });
    if (items.length <= 1) {
      items.push('Performance');
    }
    items.push('GOV.UK');
    return items.join(' - ');
  },

  getMetaDescription: function () {
    return null;
  },

  getBreadcrumbCrumbs: function () {
    return [
      {'path': '/performance', 'title': 'Performance'}
    ];
  },

  getBreadcrumbs: function () {
    var breadcrumbs = this.getBreadcrumbCrumbs().filter(_.identity);
    breadcrumbs = this.ellipsifyBreadcrumbs(breadcrumbs);
    return {'breadcrumbs': breadcrumbs};
  },

  ellipsifyBreadcrumbs: function (breadcrumbs) {
    _.each(breadcrumbs, function (b) {
      b.original_title = b.title;
      if (b.title.length > 35) {
        b.title = b.title.substring(0, 32) + '…';
      }
    });
    return breadcrumbs;
  },

  templateContext: function () {
    var baseContext = this.model.toJSON();
    baseContext.model = this.model;

    return _.extend(
      View.prototype.templateContext.apply(this, arguments),
      baseContext,
      {
        head: headTemplate(_.extend(baseContext, { metaDescription: this.getMetaDescription() })),
        bodyEnd: this.bodyEndTemplate(baseContext),
        topOfPage: '',
        pageTitle: this.getPageTitle(),
        bodyClasses: '',
        headerClass: 'with-proposition',
        htmlLang: 'en',
        propositionHeader: navigationTemplate,
        cookieMessage: cookieMessageTemplate(),
        footerTop: footerTopTemplate(),
        footerSupportLinks: footerLinksTemplate(),
        content: contentTemplate({
          breadcrumbs: this.breadcrumbsTemplate(this.getBreadcrumbs()),
          content: this.getContent(),
          reportAProblem: this.reportAProblemTemplate(baseContext)
        })
      }
    );
  }

});
