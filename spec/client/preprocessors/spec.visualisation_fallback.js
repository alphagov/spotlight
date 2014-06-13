define([
  'client/preprocessors/visualisation_fallback',
  'modernizr'
], function (visualisationFallback, Modernizr) {
  describe('Module actions', function () {

    var el;
    beforeEach(function () {
      el = $('<div class="visualisation-inner" data-src="spec/client/preprocessors/transparent.gif">original content</div>');
      $('body').append(el);
    });

    afterEach(function () {
      $('.visualisation-inner').remove();
    });

    it('does nothing when the browser supports SVG', function () {
      Modernizr.inlinesvg = true;
      visualisationFallback();
      expect(el.html()).toEqual('original content');
    });

    it('replaces the fallback container content with a fallback image', function () {
      Modernizr.inlinesvg = false;
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
