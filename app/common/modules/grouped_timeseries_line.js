define([
  'common/modules/grouped_timeseries'
],
function (GroupedTimeseriesModule) {

  // This is an extension only because we can't have two modules with the same
  // className on a dashboard. When this is fixed, this shall be removed.
  var GroupedTimeseriesLineModule = GroupedTimeseriesModule.extend({
    className: 'grouped-timeseries-line'
  });

  return GroupedTimeseriesLineModule;
});
