define([
  'modernizr',
  'jquery'
], function (Modernizr, $) {
  var fallback = function () {
    if (fallback.Modernizr.inlinesvg) {
      return;
    }

    $('.visualisation-fallback').each(function () {
      var img = $('<img/>').attr('src', $(this).data('src'));
      var $this = $(this);
      img.on('load', function () {
        $this.html(img);
      });
    });
  };

  fallback.Modernizr = Modernizr;

  return fallback;
});
