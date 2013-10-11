define([
  'tpl!common/templates/govuk_template.html',
  'tpl!common/templates/head.html'
],
function (baseTemplate, headTemplate) {

  var environment = process.env.NODE_ENV || 'development';

  var head = headTemplate({
    environment: environment
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
