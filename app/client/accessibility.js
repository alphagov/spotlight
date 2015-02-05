define(['jquery'],
  function ($) {
    return {
      createLiveRegion: function() {
        var $liveRegionContainer = $('.live-region-container');
        if ($liveRegionContainer.length === 0) {
          return $('<div class="visuallyhidden live-region-container" aria-live="polite"></div>').appendTo('body');
        } else {
          return $liveRegionContainer;
        }
      },

      /**
       * @param text - text to update with
       * @param {jQuery} [$liveRegionContainer] should be a container element with aria-live="assertive"
       */
      updateLiveRegion: function(text, $liveRegionContainer) {
        if (!$liveRegionContainer || !$liveRegionContainer.length) {
          $liveRegionContainer = this.createLiveRegion();
        }
        $liveRegionContainer.empty();
        $liveRegionContainer.text(text);

      }
    };

  });
