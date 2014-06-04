var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var CompletionRateController = requirejs('common/modules/completion_rate');

var CompletionRateView = require('../views/modules/completion_rate');

var parent = ModuleController.extend(CompletionRateController);

module.exports = parent.extend({

  visualisationClass: CompletionRateView,

  visualisationOptions: function () {
    return _.extend(parent.prototype.visualisationOptions.apply(this, arguments), {
      url: this.url
    });
  }

});
