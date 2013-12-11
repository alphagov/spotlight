define([
  'common/modules/grouped_timeseries'
],
function (GroupedTimeseriesModule) {

  // This is an extension only because we can't have two modules with the same
  // className on a dashboard. When this is fixed, this shall be removed.
  var GroupedTimeseries3Module = GroupedTimeseriesModule.extend({
    className: 'grouped_timeseries_3'
  });

  return GroupedTimeseries3Module;
});
