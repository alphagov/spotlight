define({
  load: function(name, req, onLoad, config) {
    function browserDoesNotSupportD3() {
      return $('.lte-ie8').length;
    }

    if (!config.isBuild && browserDoesNotSupportD3()) {
      onLoad();
    } else {
      req(['d3'], function (d3) {
        onLoad(d3);
      });
    }
  }
});
