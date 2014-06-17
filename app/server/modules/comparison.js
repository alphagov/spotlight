var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var ComparisonController = requirejs('common/modules/comparison');

module.exports = ModuleController.extend(ComparisonController);