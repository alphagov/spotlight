define([
  'extensions/controllers/controller',
  'common/views/dashboard',
  'common/views/dashboards/content',
  'common/views/dashboards/transaction',
  'common/views/dashboards/department'
], function (Controller, DashboardView, ContentDashboardView, TransactionDashboardView, DeptDashboardView) {

  var DashboardController = Controller.extend({

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
      }
    },

    viewOptions: function () {
      return {
        moduleInstances: this.moduleInstances
      };
    },

    render: function (options) {
      options = options || {};

      this.moduleInstances = this.renderModules(
        this.modules,
        this.model,
        {
          dashboard: true,
          url: this.url
        },
        { init: options.init },
        Controller.prototype.render.bind(this, options)
      );
    }
  });

  return DashboardController;

});
