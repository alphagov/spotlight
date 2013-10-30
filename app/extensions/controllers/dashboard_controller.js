define([
  'extensions/controller',
], function (Controller) {

  var DashboardController = Controller.extend({

    viewClass: DashboardView,

    render: function() {
      var remaining = this.modules.length;
      var onReady = function() {
        if (--remaining === 0) {
          this.trigger('ready');
        }
      };
      this.modules.each(function(moduleClass) {
        var module = new moduleClass({
          model: this.model
        });
        module.once('ready', onReady);
        module.render();
      }, this);
      Controller.prototype.render.apply(this, arguments);
    },

    modules: [
    ]
  });

  return DashboardController;

});
