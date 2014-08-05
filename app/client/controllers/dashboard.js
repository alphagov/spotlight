define([
  'extensions/controllers/dashboard'
], function (Controller) {
  return Controller.extend({

    initialize: function () {
      this.modules = this.model.get('modules') || [];
    },

    render: function (options) {
      this.renderDashboard(options, _.bind(function () { this.trigger('ready'); }, this));
    }
  });
});
