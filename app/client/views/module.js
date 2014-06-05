define([
  'common/views/module',
  'client/views/graph/table',
  'client/views/table'
], function (ModuleView, GraphTable, Table) {

  return ModuleView.extend({
    views: function () {
      var pageType = this.model.get('parent').get('page-type');
      var views = this.hasTable ? {
        '.visualisation-table': {
          view: pageType === 'module' ? Table : GraphTable
        }
      } : {};
      return _.extend(ModuleView.prototype.views.apply(this, arguments), views);
    }
  });

});