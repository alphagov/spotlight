define([
  'backbone',
  'page_config',
  'extensions/controllers/controller',
  'common/views/labs'
],
function (Backbone, PageConfig, Controller, LabsView) {

  var LabsController = Controller.extend({
    viewClass: LabsView
  });

  var labs = function (req, res, next) {
    var model = new Backbone.Model();

    model.set(PageConfig.commonConfig(req));

    var labsController = new LabsController({
      model: model,
      raw: req.query.raw,
      url: req.originalUrl
    });

    labsController.render();

    res.send(labsController.html);
  };

  return labs;
});
