define([
  'client/preprocessors/visualisation_fallback'
], function (visualisationFallback) {
  describe('Module actions', function () {

    var originalModernizr = visualisationFallback.Modernizr;

    var el;
    beforeEach(function () {
      visualisationFallback.Modernizr = {};
      el = $('<div class="visualisation-fallback" data-src="spec/client/preprocessors/transparent.gif">original content</div>');
      $('body').append(el);
    });

    afterEach(function () {
      visualisationFallback.Modernizr = originalModernizr;
      $('.visualisation-fallback').remove();
    });

    it('does nothing when the browser supports SVG', function () {
      visualisationFallback.Modernizr.inlinesvg = true;
      visualisationFallback();
      expect(el.html()).toEqual('original content');
    });

    it('replaces the fallback container content with a fallback image', function () {
      visualisationFallback.Modernizr.inlinesvg = false;
      visualisationFallback();

      waitsFor(function () {
        return (el.html() !== 'original content');
      });

      runs(function () {
        expect(el.html()).toEqual('<img src="spec/client/preprocessors/transparent.gif">');
      });
    });
  });
});
