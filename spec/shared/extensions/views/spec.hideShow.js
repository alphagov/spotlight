define([
  'extensions/views/hideShow',
  'extensions/views/view',
  'jquery'
],
function (HideShow, View, $) {
  describe('HideShow', function () {
    var hideShow, $el,
      event = {
        preventDefault: jasmine.createSpy()
      };
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

      it('creates a handle with a class name is specified', function () {
        hideShow = new HideShow({
          $el: $el,
          className: 'testClassName'
        });
        expect(hideShow.$handle.attr('class')).toEqual('testClassName');
      });

      it('inserts the handle before the item it reveals', function () {
        expect(hideShow.$handle.next().text()).toEqual(hideShow.$reveal.text());
      });
    });

    describe('showHide', function () {
      beforeEach(function () {
        spyOn(hideShow, 'show');
        spyOn(hideShow, 'hide');
      });

      it('calls the show method when the item is hidden', function () {
        hideShow.$reveal.hide();
        hideShow.showHide(event);
        expect(hideShow.show).toHaveBeenCalled();
      });

      it('calls the hide method when the item is shown', function () {
        hideShow.$reveal.show();
        hideShow.showHide(event);
        expect(hideShow.hide).toHaveBeenCalled();
      });

      it('prevents default on the javascript event', function () {
        hideShow.showHide(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('show', function () {
      it('it shows the element and changes the text handle', function () {
        hideShow.show();
        expect(hideShow.$reveal.is(':visible')).toEqual(true);
        expect(hideShow.$handle.text()).toEqual('Hide the thing.');
      });
    });

    describe('hide', function () {
      it('it hides the element and changes the text handle', function () {
        hideShow.hide();
        expect(hideShow.$reveal.is(':visible')).toEqual(false);
        expect(hideShow.$handle.text()).toEqual('Show the thing.');
      });
    });
  });
});
