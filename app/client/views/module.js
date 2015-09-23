define([
  'common/views/module',
  'client/views/table',
  'client/views/date-picker',
  'client/views/json-summary'
], function (ModuleView, Table, DatePicker, JsonSummary) {

  return ModuleView.extend({

    datePickerClass: DatePicker,

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
            view: this.datePickerClass
          };
        }
        views['.json-summary'] = {
            view: JsonSummary
        };
      }
      return _.extend(ModuleView.prototype.views.apply(this, arguments), views);
    }
  });

});