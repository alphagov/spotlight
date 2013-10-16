define([
  'stache!common/templates/govuk_template',
  'stache!common/templates/head'
],
function (baseTemplate, headTemplate) {

  var environment = process.env.NODE_ENV || 'development';

  var head = headTemplate({
    requirePath: requirePath,
    assetPath: assetPath,
    development: environment === 'development'
  });

  return function render (req, res) {
    var context = {
      environment: environment,
      requirePath: requirePath,
      assetPath: assetPath,
      showHeader: true,
      topOfPage: "",
      pageTitle: "",
      head: head,
      bodyClasses: "",
      insideHeader: "",
      cookieMessage: "",
      content: "",
      footerTop: "",
      footerSupportLinks: "",
      bodyEnd: ""
    };

    res.send(baseTemplate(context));
  };
});
