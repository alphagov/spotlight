var Backbone = require('backbone');
var requirejs = require('requirejs');

var dashboards = require('../../support/stagecraft_stub/responses/dashboards');

var View = require('../views/homepage');

var Collection = requirejs('common/collections/dashboards');
var PageConfig = requirejs('page_config');

module.exports = function (req, res) {
  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    'data': dashboards.items
  }));

  var collection = new Collection(dashboards.items);

  var view = new View({
    model: model,
    collection: collection
  });
  view.render();

  res.set('Cache-Control', 'public, max-age=120');
  res.send(view.html);
};
