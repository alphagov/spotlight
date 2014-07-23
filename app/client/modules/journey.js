define([
  'client/controllers/module',
  'client/views/journey-date-picker',
  'common/modules/journey',
  'common/views/visualisations/journey-graph/journey-graph'
], function (ModuleController, DatePickerView, JourneyModule, JourneyView) {

  var parent = ModuleController.extend(JourneyModule);

  return parent.extend({

    visualisationClass: JourneyView,

    viewOptions: function () {
      return _.extend(parent.prototype.viewOptions.apply(this, arguments), {
        datePickerClass: DatePickerView
      });
    }


  });

});