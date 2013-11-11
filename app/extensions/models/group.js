define([
  'extensions/models/model',
  'extensions/collections/timeseries'
],
function (Model, Timeseries) {
  
  var Group = Model.extend({

    parse: function (data) {
      data.values = new Timeseries(data.values, {
        parse: true
      });
      return data;
    }
  });
  
  return Group;
});
