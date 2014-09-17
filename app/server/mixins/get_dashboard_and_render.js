var requirejs = require('requirejs');

var controllerMap = require('../../server/controller_map')();
var StagecraftApiClient = requirejs('stagecraft_api_client');

module.exports = function (req, res, renderContent) {
  var client_instance = new StagecraftApiClient({}, {
    ControllerMap: controllerMap 
  });
  client_instance.urlRoot = 'http://localhost:' + req.app.get('port') + '/stagecraft-stub/';
  client_instance.stagecraftUrlRoot = req.app.get('stagecraftUrl') + '/public/dashboards';
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
