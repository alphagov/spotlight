var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('extensions/views/view');
var templater = require('../mixins/templater');

var pr = path.resolve.bind(path, __dirname);

var headTemplate = pr('../templates/page-components/head.html');
var bodyEndTemplate = pr('../templates/page-components/body-end.html');
var navigationTemplate = pr('../templates/page-components/navigation.html');
var breadcrumbsTemplate = pr('../templates/page-components/breadcrumbs.html');
var govukTemplate = pr('../templates/page-components/govuk_template.html');
var footerTopTemplate = pr('../templates/page-components/footer_top.html');
var footerLinksTemplate = pr('../templates/page-components/footer_links.html');
var reportAProblemTemplate = pr('../templates/page-components/report_a_problem.html');
var cookieMessageTemplate = pr('../templates/page-components/cookie_message.html');
var contentTemplate = pr('../templates/page-components/content.html');


/**
 * Renders a page in GOV.UK style using govuk_template.
 * Does not use jsdom itself but renders template directly because jsdom
 * does not seem to play nicely with <script> tags.
 */
module.exports = View.extend(templater).extend({
  template: govukTemplate,
  bodyEndTemplate: bodyEndTemplate,
  reportAProblemTemplate: reportAProblemTemplate,
  breadcrumbsTemplate: breadcrumbsTemplate,

  getContent: function () {
    return '';
  },

  render: function () {
    var context = this.templateContext();
    this.html = this.loadTemplate(this.template, context, 'mustache');
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

  hasSurvey: function () {
    return false;
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
        head: this.loadTemplate(headTemplate, _.extend(baseContext, { metaDescription: this.getMetaDescription() })),
        bodyEnd: this.loadTemplate(this.bodyEndTemplate, baseContext),
        topOfPage: '',
        pageTitle: this.getPageTitle(),
        bodyClasses: '',
        headerClass: 'with-proposition',
        htmlLang: 'en',
        propositionHeader: this.loadTemplate(navigationTemplate, 'mustache'),
        cookieMessage: this.loadTemplate(cookieMessageTemplate, 'mustache'),
        footerTop: this.loadTemplate(footerTopTemplate, 'mustache'),
        footerSupportLinks: this.loadTemplate(footerLinksTemplate, 'mustache'),
        content: this.loadTemplate(contentTemplate, {
          hasSurvey: this.hasSurvey(),
          breadcrumbs: this.loadTemplate(this.breadcrumbsTemplate, this.getBreadcrumbs(), 'mustache'),
          content: this.getContent(),
          reportAProblem: this.loadTemplate(this.reportAProblemTemplate, baseContext)
        }, 'mustache')
      }
    );
  }

});
