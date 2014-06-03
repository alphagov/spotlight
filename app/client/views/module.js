define([
  'common/views/module',
  'client/views/graph/table'
], function (ModuleView, GraphTable) {

  return ModuleView.extend({
    views: function () {
      var views = this.hasTable ? {
        '.visualisation-table': {
          view: GraphTable
        }
      } : {};
      return _.extend(ModuleView.prototype.views.apply(this, arguments), views);
    }
  });

});