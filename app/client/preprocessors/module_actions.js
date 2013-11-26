define([
  'modernizr',
  'jquery'
], function (Modernizr, $) {
  var applyTouchActions = function () {
    var eventName;
    if (applyTouchActions.Modernizr.touch) {
      eventName = 'touchend';
    } else {
      eventName = 'click';
    }
    $('section').on(eventName, '.more-info-link', function(e) {
      var close = function(e) {
        item.removeClass('js-clicked');
        $('body').off(eventName, close);
        $(this).next('ul').off(eventName, preventBubbling);
      };

      var preventBubbling = function(e) {
        if(!$(e.target).is('a')){
          return false;
        }
      };

      var item = $(this).next('ul');
      if (item.hasClass('js-clicked')) {
        close();
        return false;
      }
      $('.more-info ul').removeClass('js-clicked');
      item.addClass('js-clicked');
      $(this).next('ul').on(eventName, preventBubbling);
      $('body').one(eventName, close);
      return false;
    });
  };

  applyTouchActions.Modernizr = Modernizr;

  return applyTouchActions;
});
