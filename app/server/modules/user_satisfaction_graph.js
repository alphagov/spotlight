var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var UserSatisfactionController = requirejs('common/modules/user_satisfaction_graph');

var UserSatisfactionView = require('../views/modules/user_satisfaction_graph');

module.exports = ModuleController.extend(UserSatisfactionController).extend({

  visualisationClass: UserSatisfactionView

});
