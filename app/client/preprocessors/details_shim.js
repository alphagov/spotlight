define([
  'jquery'
], function ($) {
      
  var setUpShim = function () {
    
    // Add conditional classname based on support
    $('html').addClass($.fn.details.support ? 'details' : 'no-details');

    // Emulate <details> where necessary.
    $('details').details();

  };
  
  return setUpShim;
});
