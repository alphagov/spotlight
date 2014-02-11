define([
  'backbone',
  'page_config',
  'extensions/controllers/controller',
  'common/views/prototypes'
],
function (Backbone, PageConfig, Controller, PrototypesView) {

  var PrototypesController = Controller.extend({
    viewClass: PrototypesView
  });

  var prototypes = function (req, res, next) {
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

  return prototypes;
});
