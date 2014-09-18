var requirejs = require('requirejs');

var controllerMap = require('../../server/controller_map')();
var StagecraftApiClient = requirejs('stagecraft_api_client');

var buildStagecraftApiClient = function(req){
  var this_client_instance = new StagecraftApiClient({}, {
    ControllerMap: controllerMap,
    requestId: req.get('Request-Id')
  });
  this_client_instance.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub/';
  this_client_instance.stagecraftUrlRoot = req.app.get('stagecraftUrl') + '/public/dashboards';
  return this_client_instance;
};

var get_dashboard_and_render = function (req, res, renderContent) {
  var client_instance = get_dashboard_and_render.buildStagecraftApiClient(req); 
  var error_count = 0;

  client_instance.on('error', function () {
    if(error_count === 1){
      client_instance.off();
      res.status(client_instance.get('status'));
      renderContent(req, res, client_instance);
    }
    error_count ++; 
  });
  client_instance.on('sync', function () {
    client_instance.off();
    res.status(client_instance.get('status'));
    renderContent(req, res, client_instance);
  });

  return client_instance;
};

get_dashboard_and_render.buildStagecraftApiClient = buildStagecraftApiClient;

module.exports = get_dashboard_and_render;
