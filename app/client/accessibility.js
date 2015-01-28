define(['jquery'],
  function ($) {
    return {
      /**
       * @param $el should be a container element with aria-live="assertive"
       * @param value - html or value to update with
       */
      updateLiveRegion: function($el, value) {
        $el.empty();
        $('<span class="js-aria-live-inner" role="status" aria-atomic="false" aria-relevant="text" />')
          .appendTo($el)
          .append(value)
          .css('visibility', 'hidden')
          .css('visibility', 'visible');

      }
    };

  });