define([
  'client/preprocessors/module_actions'
], function (applyModuleActions) {
  describe('Module actions', function() {

    var originalModernizr = applyModuleActions.Modernizr;
    var moreInfoLink;
    var ul;

    beforeEach(function() {
      $('body').append($('<section><aside class="more-info" id="module1"><span class="more-info-link"></span><ul><li>'));
      moreInfoLink = $('.more-info-link');
      ul = $('.more-info ul');
    });

    describe('touch behaviour', function() {

      beforeEach(function() {
        applyModuleActions.Modernizr = {
          touch: true
        };
      });

      afterEach(function() {
        applyModuleActions.Modernizr = originalModernizr;
        $('.more-info').remove();
      });

      it('should show a callout on touch', function() {
        applyModuleActions();
        expect(ul).not.toHaveClass('js-clicked');
        moreInfoLink.trigger('touchend');
        expect(ul).toHaveClass('js-clicked');
      });

      it('should toggle the callout on repeated touches', function() {
        applyModuleActions();
        expect(ul).not.toHaveClass('js-clicked');
        moreInfoLink.trigger('touchend');
        expect(ul).toHaveClass('js-clicked');
        moreInfoLink.trigger('touchend');
        expect(ul).not.toHaveClass('js-clicked');
      });

      it("should close the callout when the user touches somewhere else on the page", function () {
        applyModuleActions();
        moreInfoLink.trigger('touchend');
        expect(ul).toHaveClass('js-clicked');
        $('body').trigger('touchend');
        expect(ul).not.toHaveClass('js-clicked');
      });

      it("should close other open callouts on touch", function () {
        $('body').append($('<section><aside class="more-info" id="module2"><span class="more-info-link"></span><ul><li>'));
        applyModuleActions();

        $('#module1 .more-info-link').trigger('touchend');
        expect($('#module1 ul')).toHaveClass('js-clicked');
        expect($('#module2 ul')).not.toHaveClass('js-clicked');

        $('#module2 .more-info-link').trigger('touchend');
        expect($('#module1 ul')).not.toHaveClass('js-clicked');
        expect($('#module2 ul')).toHaveClass('js-clicked');
      });

      it("should not close the callout when the user touches the info box", function () {
        applyModuleActions();
        moreInfoLink.trigger('touchend');
        expect(ul).toHaveClass('js-clicked');
        ul.trigger('touchend');
        expect(ul).toHaveClass('js-clicked');
        ul.find('li').trigger('touchend');
        expect(ul).toHaveClass('js-clicked');
        $('body').trigger('touchend');
        expect(ul).not.toHaveClass('js-clicked');
      });

    });

    describe("non-touch behaviour", function () {

      beforeEach(function() {
        applyModuleActions.Modernizr = {
          touch: false
        };
      });

      afterEach(function() {
        applyModuleActions.Modernizr = originalModernizr;
        $('.more-info').remove();
      });

      it('should show a callout on click', function() {
        applyModuleActions();
        expect(ul).not.toHaveClass('js-clicked');
        moreInfoLink.trigger('click');
        expect(ul).toHaveClass('js-clicked');
      });

      it('should toggle the callout on repeated clicks', function() {
        applyModuleActions();
        expect(ul).not.toHaveClass('js-clicked');
        moreInfoLink.trigger('click');
        expect(ul).toHaveClass('js-clicked');
        moreInfoLink.trigger('click');
        expect(ul).not.toHaveClass('js-clicked');
      });

      it("should close the callout when the user clicks somewhere else on the page", function () {
        applyModuleActions();
        moreInfoLink.trigger('click');
        expect(ul).toHaveClass('js-clicked');
        $('body').trigger('click');
        expect(ul).not.toHaveClass('js-clicked');
      });

      it("should close other open callouts on click", function () {
        $('body').append($('<section><aside class="more-info" id="module2"><span class="more-info-link"></span><ul><li>'));
        applyModuleActions();

        $('#module1 .more-info-link').trigger('click');
        expect($('#module1 ul')).toHaveClass('js-clicked');
        expect($('#module2 ul')).not.toHaveClass('js-clicked');

        $('#module2 .more-info-link').trigger('click');
        expect($('#module1 ul')).not.toHaveClass('js-clicked');
        expect($('#module2 ul')).toHaveClass('js-clicked');
      });

      it("should not close the callout when the user clicks the info box", function () {
        applyModuleActions();
        moreInfoLink.trigger('click');
        expect(ul).toHaveClass('js-clicked');
        ul.trigger('click');
        expect(ul).toHaveClass('js-clicked');
        ul.find('li').trigger('click');
        expect(ul).toHaveClass('js-clicked');
        $('body').trigger('click');
        expect(ul).not.toHaveClass('js-clicked');
      });

    });
  });
});
