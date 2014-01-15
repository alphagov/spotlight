define([
  'client/preprocessors/details_shim'
], function (detailsShim) {
  describe('Module actions', function() {
    
    var el;
    var summaryLink;
    var ul;
    
    beforeEach(function() {
      var html = '<details class="more-info"><summary class="more-info-link">more info';
      html += '</summary><ul><li>details</li></ul>';
      html += '</div>';
      el = $(html);
      $('body').append(el);
      summaryLink = $('summary');
    });

    afterEach(function() {
      $('details').remove();
    });
    
    describe('in browsers that support the details tag', function() {
      
      beforeEach(function() {
        detailsShim();
      });
    
      it('adds details class', function() {
        expect($('html')).toHaveClass('details');
      });
    
      it('adds expected attributes to details elements', function() {
        var summary = $('summary');
        expect(summary.attr('role')).toEqual('button');
        expect(summary.attr('aria-expanded')).toEqual('false');
      });
    
   });
   
    describe('non-touch behaviour', function() {
      
      beforeEach(function() {
        var jQueryCopy = $;
        jQueryCopy.fn.details.support = false;
        detailsShim(jQueryCopy);
      });
    
      it('adds no-details class if the browser does not support the details tag', function() {
        expect($('html')).toHaveClass('no-details');
      });
      
      it('adds expected attributes to details elements', function() {
        var summary = $('summary');
        expect(summary.attr('role')).toEqual('button');
        expect(summary.attr('aria-expanded')).toEqual('false');
      });
    
   });

  });
});
