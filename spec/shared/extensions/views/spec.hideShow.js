define([
  'extensions/views/hideShow',
  'extensions/views/view',
  'jquery'
],
function (HideShow, View, $) {
  describe('HideShow', function () {
    var hideShow, $el;
    beforeEach(function () {
      var $reveal = $('<div>thing to show</div>').hide();
      $el = $('<div></div>');

      $reveal.appendTo($el);
      $el.appendTo('body');

      hideShow = new HideShow({
        $reveal: $reveal,
        $el: $el,
        showLabel: 'Show the thing.',
        hideLabel: 'Hide the thing.'
      });
    });

    afterEach(function () {
      $el.remove();
      hideShow.remove();
    });

    it('inherits from View', function () {
      expect(hideShow instanceof View).toBe(true);
    });

    describe('initialize', function () {
      var hideShow;
      beforeEach(function () {
        spyOn(HideShow.prototype, 'render');
        spyOn(View.prototype, 'initialize');
        hideShow = new HideShow({
        });
      });

      it('calls render', function () {
        expect(HideShow.prototype.render).toHaveBeenCalled();
      });

      it('calls initialize on the View', function () {
        expect(View.prototype.initialize).toHaveBeenCalled();
      });
    });

    describe('render', function () {
      it('create a handle and insert it', function () {
        expect(hideShow.$el.find('a').length).toEqual(1);
      });

      it('inserts the handle before the item it reveals', function () {
        expect(hideShow.$handle.next().text()).toEqual(hideShow.$reveal.text());
      });
    });

    describe('showHide', function () {
      it('shows the $reveal item when its hidden and updates the handle text', function () {
        expect(hideShow.$reveal.is(':visible')).toEqual(false);
        expect(hideShow.$handle.text()).toEqual('Show the thing.');

        hideShow.showHide();

        expect(hideShow.$reveal.is(':visible')).toEqual(true);
        expect(hideShow.$handle.text()).toEqual('Hide the thing.');
      });

      it('hides the $reveal item when its shown and updates the handle text', function () {
        hideShow.showHide();
        expect(hideShow.$reveal.is(':visible')).toEqual(true);
        expect(hideShow.$handle.text()).toEqual('Hide the thing.');

        hideShow.showHide();
        expect(hideShow.$reveal.is(':visible')).toEqual(false);
        expect(hideShow.$handle.text()).toEqual('Show the thing.');
      });
    });
  });
});
