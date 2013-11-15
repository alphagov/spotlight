define([
  'modernizr',
  'jquery'
], function (Modernizr, $) {
  var fallback = function () {
    if (fallback.Modernizr.inlinesvg) {
      return;
    }

    $('.visualisation-fallback').each(function () {
      $(this).html($('<img/>').attr('src', $(this).data('src')));
    });
  };

  fallback.Modernizr = Modernizr;

  return fallback;
});
