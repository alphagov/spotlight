define([
  'modernizr',
  'jquery'
], function (Modernizr, $) {
  var fallback = function () {
    if (Modernizr.inlinesvg) {
      return;
    }

    $('[data-src]').each(function () {
      var $this = $(this);
      var img = $('<img/>').attr('src', $this.data('src'));
      // insert image on load to work around IE6 display issues
      img.on('load', function () {
        $this.html(img);
      });
    });
  };

  return fallback;
});
