var GroupController = require('./group');
var TabView = require('../views/modules/tab');

module.exports = GroupController.extend({
  visualisationClass: TabView,
  moduleProperty: 'tabs'
});