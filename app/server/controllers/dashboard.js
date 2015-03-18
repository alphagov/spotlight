var requirejs = require('requirejs');

var Controller = requirejs('extensions/controllers/dashboard');

var DashboardView = require('../views/dashboard');
var ContentDashboardView = require('../views/dashboards/content');
var TransactionDashboardView = require('../views/dashboards/transaction');
var DeptDashboardView = require('../views/dashboards/department');
var OtherDashboardView = require('../views/dashboards/other');

module.exports = Controller.extend({

  viewClass: DashboardView,

  initialize: function () {
    this.modules = this.model.get('modules') || [];
    this.moduleInstances = [];
    var type = this.model.get('dashboard-type');
    if (type === 'transaction' || type === 'high-volume-transaction') {
      this.viewClass = TransactionDashboardView;
    } else if (type === 'agency' || type === 'department') {
      this.viewClass = DeptDashboardView;
    } else if (type === 'content') {
      this.viewClass = ContentDashboardView;
    } else if (type === 'other') {
      this.viewClass = OtherDashboardView;
    }
  },

  viewOptions: function () {
    return {
      moduleInstances: this.moduleInstances
    };
  },

  render: function (options) {
    this.renderDashboard(options, Controller.prototype.render.bind(this, options));
  }

});