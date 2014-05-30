define([
  'modernizr',
  'jquery'
], function (Modernizr, $) {
  var fallback = function () {
    if (fallback.Modernizr.inlinesvg) {
      return;
    }

    $('.visualisation-inner').each(function () {
      var img = $('<img/>').attr('src', $(this).data('src'));
      var $this = $(this);
      // insert image on load to work around IE6 display issues
      img.on('load', function () {
        $this.html(img);
      });
    });
  };

  fallback.Modernizr = Modernizr;

  return fallback;
});
