var requirejs = require('requirejs');
var Backbone = require('backbone');

var PageConfig = requirejs('page_config');
var Controller = requirejs('extensions/controllers/controller');
var PrototypesView = require('../views/prototypes');


var PrototypesController = Controller.extend({
  viewClass: PrototypesView
});

module.exports = function (req, res) {
  var model = new Backbone.Model();

  model.set(PageConfig.commonConfig(req));

  var prototypesController = new PrototypesController({
    model: model,
    raw: req.query.raw,
    url: req.originalUrl
  });

  prototypesController.render();

  res.send(prototypesController.html);
};
