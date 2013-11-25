define({
  load: function(name, req, onLoad, config) {
    var browserSupportsD3 = function () {
      return !$('.lte-ie8').length;
    };

    if (!config.isBuild && browserSupportsD3() || config.isBuild && config.d3) {
      req(['d3'], function (d3) {
        onLoad(d3);
      });
    } else {
      onLoad({});
    }
  }
});
