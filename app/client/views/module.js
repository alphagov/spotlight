define([
  'common/views/module',
  'client/views/table',
  'client/views/date-picker'
], function (ModuleView, Table, DatePicker) {

  return ModuleView.extend({
    views: function () {
      var pageType = this.model.get('parent').get('page-type');
      var views = {};
      if (pageType === 'module') {
        if (this.hasTable) {
          views['.visualisation-table'] = {
            view: Table,
            options: this.visualisationOptions
          };
        }
        if (this.hasDatePicker) {
          views['.date-picker'] = {
            view: DatePicker
          };
        }
      }
      return _.extend(ModuleView.prototype.views.apply(this, arguments), views);
    }
  });

});