var requirejs = require('requirejs');
var Backbone = require('backbone');

var services = require('../../support/stagecraft_stub/responses/services');

var View = require('../views/services');

var Collection = requirejs('common/collections/filtered_list');
var PageConfig = requirejs('page_config');

module.exports = function (req, res) {
  var model = new Backbone.Model(_.extend(PageConfig.commonConfig(req), {
    title: 'Services',
    'page-type': 'services',
    'filter': req.query.filter || '',
    'data': services.items
  }));

  var collection = new Collection(services.items);

  var view = new View({
    model: model,
    collection: collection
  });
  view.render();

  res.send(view.html);
};