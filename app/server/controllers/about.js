var Backbone = require('backbone');
var requirejs = require('requirejs');

var View = require('../views/about');

var PageConfig = requirejs('page_config');

module.exports = function (req, res) {
  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {}));

  var view = new View({
    model: model,
  });
  view.render();

  res.set('Cache-Control', 'public, max-age=7200');
  res.send(view.html);
};
