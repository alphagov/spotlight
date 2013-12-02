define([
  'client/preprocessors/visualisation_fallback'
], function (visualisationFallback) {
  describe('Module actions', function() {

    var originalModernizr = visualisationFallback.Modernizr;
    var moreInfoLink;
    var ul;

    var el;
    beforeEach(function() {
      visualisationFallback.Modernizr = {};
      el = $('<div class="visualisation-fallback" data-src="/test/src">original content</div>');
      $('body').append(el);
    });

    afterEach(function() {
      visualisationFallback.Modernizr = originalModernizr;
      $('.visualisation-fallback').remove();
    });

    it('does nothing when the browser supports SVG', function() {
      visualisationFallback.Modernizr.inlinesvg = true;
      visualisationFallback();
      expect(el.html()).toEqual('original content');
    });

    xit('replaces the fallback container content with a fallback image', function() {
      visualisationFallback.Modernizr.inlinesvg = false;
      visualisationFallback();
      expect(el.html()).toEqual('<img src="/test/src">');
    });
  });
});
