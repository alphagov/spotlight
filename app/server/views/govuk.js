var requirejs = require('requirejs');
var path = require('path');

var serialize = require('serialize-javascript');

var View = requirejs('extensions/views/view');
var templater = require('../mixins/templater');

var pr = path.resolve.bind(path, __dirname);

var headTemplate = pr('../templates/page-components/head.html');
var bodyEndTemplate = pr('../templates/page-components/body-end.html');
var navigationTemplate = pr('../templates/page-components/navigation.html');
var govukTemplate = pr('../templates/page-components/govuk_template.html');
var footerTopTemplate = pr('../templates/page-components/footer_top.html');
var footerLinksTemplate = pr('../templates/page-components/footer_links.html');
var reportAProblemTemplate = pr('../templates/page-components/report_a_problem.html');
var cookieMessageTemplate = pr('../templates/page-components/cookie_message.html');
var contentTemplate = pr('../templates/page-components/content.html');
var surveyTemplate = pr('../templates/page-components/survey.html');


/**
 * Renders a page in GOV.UK style using govuk_template.
 * Does not use jsdom itself but renders template directly because jsdom
 * does not seem to play nicely with <script> tags.
 */
module.exports = View.extend(templater).extend({
  templatePath: govukTemplate,
  templateType: 'mustache',
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
      return _.isString(el);
    });
    if (items.length <= 1) {
      items.push('Performance');
    }
    items.push('GOV.UK');
    return items.join(' - ');
  },

  getBodyClasses: function() {
    return '';
  },

  getMetaDescription: function () {
    return null;
  },

  getReportForm: function () {
    return this.loadTemplate(this.reportAProblemTemplate, this.model.toJSON(), 'mustache');
  },

  templateContext: function () {
    var baseContext = this.model.toJSON();
    baseContext.model = this.model;

    var serializedModel = serialize(this.model.toJSON(), { isJSON: true });

    var headContext = _.extend(baseContext, { metaDescription: this.getMetaDescription() });
    var bodyEndContext = _.extend(baseContext, { serializedModel: serializedModel });

    return _.extend(
      View.prototype.templateContext.apply(this, arguments),
      baseContext,
      {
        head: this.loadTemplate(headTemplate, headContext),
        bodyEnd: this.loadTemplate(this.bodyEndTemplate, bodyEndContext),
        topOfPage: '',
        pageTitle: this.getPageTitle(),
        bodyClasses: this.getBodyClasses(),
        headerClass: 'with-proposition',
        htmlLang: 'en',
        propositionHeader: this.loadTemplate(navigationTemplate, 'mustache'),
        cookieMessage: this.loadTemplate(cookieMessageTemplate, 'mustache'),
        footerTop: this.loadTemplate(footerTopTemplate, 'mustache'),
        footerSupportLinks: this.loadTemplate(footerLinksTemplate, 'mustache'),
        afterHeader: this.loadTemplate(surveyTemplate),
        content: this.loadTemplate(contentTemplate, {
          content: this.getContent(),
          reportAProblem: this.getReportForm()
        }, 'mustache')
      }
    );
  }

});
