var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var TimeseriesController = requirejs('common/modules/single-timeseries');

var View = require('../views/modules/single-timeseries');

var parent = ModuleController.extend(TimeseriesController);

module.exports = parent.extend({

  visualisationClass: View,

  visualisationOptions: function () {
    return _.extend(parent.prototype.visualisationOptions.apply(this, arguments), {
      url: this.url
    });
  }

});
