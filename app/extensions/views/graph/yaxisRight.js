define([
  'require',
  './yaxis'
],
function (require, YAxis) {

  var YAxisRight = YAxis.extend({
    position: 'right',
    orient: 'right'
  });

  return YAxisRight;
});
