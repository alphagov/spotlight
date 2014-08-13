define([
  'client/controllers/module',
  'client/views/journey-date-picker',
  'common/modules/journey',
  'client/views/visualisations/journey-graph'
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