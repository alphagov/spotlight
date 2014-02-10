define([],
function () {
  var getGovUkUrl = function (req) {
    return ['https://', req.app.get('govukHost'), req.originalUrl].join('');
  };

  var commonConfig = function (req) {
    return {
      govukUrl: this.getGovUkUrl(req),
      requirePath: req.app.get('requirePath'),
      assetPath: req.app.get('assetPath'),
      assetDigest: req.app.get('assetDigest'),
      environment: req.app.get('environment'),
      backdropUrl: req.app.get('backdropUrl'),
      clientRequiresCors: req.app.get('clientRequiresCors')
    };
  };

  var PageConfig = {};

  PageConfig.getGovUkUrl = getGovUkUrl;
  PageConfig.commonConfig = commonConfig;

  return PageConfig;
});
