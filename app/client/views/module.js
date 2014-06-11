define([
  'common/views/module',
  'client/views/table'
], function (ModuleView, Table) {

  return ModuleView.extend({
    views: function () {
      var pageType = this.model.get('parent').get('page-type');
      var views = (this.hasTable && pageType === 'module') ? {
        '.visualisation-table': {
          view: Table
        }
      } : {};
      return _.extend(ModuleView.prototype.views.apply(this, arguments), views);
    }
  });

});