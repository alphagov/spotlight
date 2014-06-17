define([
  'common/views/visualisations/tab',
  'extensions/models/model'
],
function (TabView, Model) {

  describe('TabView', function () {

    var $el, view;

    beforeEach(function () {
      $el = $('<div/>');
      $el.html('<nav><ul><li><a class="">Tab 1</a></li><li><a>Tab 2</a></li></ul></nav>' +
        '<section></section><section></section>');
      view = new TabView({
        el: $el,
        model: new Model({ activeIndex: 0 })
      });

      view.render();
    });

    it('should change active when tab clicked', function () {

      var listItems = view.$el.find('li'),
          sections = view.$el.find('section');

      expect(listItems.first().hasClass('active')).toBe(true);
      expect(sections.first().hasClass('active')).toBe(true);

      listItems.last().find('a').click();

      expect(listItems.first().hasClass('active')).toBe(false);
      expect(sections.first().hasClass('active')).toBe(false);
      expect(listItems.last().hasClass('active')).toBe(true);
      expect(sections.last().hasClass('active')).toBe(true);

      listItems.first().find('a').click();

      expect(listItems.first().hasClass('active')).toBe(true);
      expect(sections.first().hasClass('active')).toBe(true);
      expect(listItems.last().hasClass('active')).toBe(false);
      expect(sections.last().hasClass('active')).toBe(false);

    });

  });

});
