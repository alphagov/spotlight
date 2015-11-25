var requirejs = require('requirejs');

function render (status, req, res) {
  var ErrorController = require('./server/controllers/error');
  var Model = requirejs('extensions/models/model');
  var PageConfig = requirejs('page_config');
  var model = new Model({
    status: status || 500
  });
  var error = new ErrorController({
    model: model
  });

  model.set(PageConfig.commonConfig(req));
  error.render();
  res.statusCode = status;
  res.send(error.html);
}

exports.render = render;

