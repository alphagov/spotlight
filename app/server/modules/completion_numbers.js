var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var CompletionNumbersController = requirejs('common/modules/completion_numbers');

var CompletionNumbersView = require('../views/modules/completion_numbers');

var parent = ModuleController.extend(CompletionNumbersController);

module.exports = parent.extend({

  visualisationClass: CompletionNumbersView,

  visualisationOptions: function () {
    return _.extend(parent.prototype.visualisationOptions.apply(this, arguments), {
      url: this.url
    });
  }

});
