define([
  'jquery'
],
function ($) {
  return function () {
    $('.js-header-toggle').on('click', function(e) {
      e.preventDefault();
      $($(e.target).attr('href')).toggleClass('js-visible');
      $(this).toggleClass('js-hidden');
    });
  };
});
