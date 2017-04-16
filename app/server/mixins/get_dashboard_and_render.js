var requirejs = require('requirejs');
var url = require('url');
var sanitizer = require('sanitizer');
var StagecraftApiClient = requirejs('stagecraft_api_client');

var controllerMap = require('../../server/controller_map')();

var sanitizeObject = function (object) {
  return _.mapValues(object, function(value) {
    return sanitizer.escape(value);
  });
};

var buildStagecraftApiClient = function (req) {
  var this_client_instance = new StagecraftApiClient({
    params: sanitizeObject(url.parse(req.originalUrl, true).query)
  }, {
    ControllerMap: controllerMap,
    requestId: req.get('Request-Id'),
    govukRequestId: req.get('GOVUK-Request-Id')
  });
  this_client_instance.stagecraftUrlRoot = req.app.get('stagecraftUrl') + '/public/dashboards';
  return this_client_instance;
};

var get_dashboard_and_render = function (req, res, renderContent) {
  var client_instance = get_dashboard_and_render.buildStagecraftApiClient(req);

  client_instance.on('error', function () {
    client_instance.off();
    res.status(client_instance.get('status'));
    renderContent(req, res, client_instance);
  });

  client_instance.on('sync', function () {
    client_instance.off();
    res.status(200);
    renderContent(req, res, client_instance);
  });

  return client_instance;
};

get_dashboard_and_render.buildStagecraftApiClient = buildStagecraftApiClient;

module.exports = get_dashboard_and_render;
