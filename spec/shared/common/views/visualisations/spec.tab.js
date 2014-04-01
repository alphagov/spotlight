define([
  'common/views/visualisations/tab',
  'extensions/models/model'
],
function (TabView, Model) {

  describe('TabView', function () {

    it('should have all the tabs', function () {
      var view = new TabView({
        tabs: [
          { title: 'Tab 1' },
          { title: 'Tab 2' }
        ],
        model: new Model({ activeIndex: 0 })
      });

      jasmine.renderView(view, function () {
        var listItems = view.$el.find('li');

        expect(listItems.length).toEqual(2);
        expect(listItems.first().text().trim()).toEqual('Tab 1');
        expect(listItems.first().hasClass('active')).toBe(true);
      });
    });

    it('should change active when tab clicked', function () {
      var view = new TabView({
        tabs: [
          { title: 'Tab 1' },
          { title: 'Tab 2' }
        ],
        model: new Model({ activeIndex: 0 })
      });

      jasmine.renderView(view, function () {
        var listItems = view.$el.find('li'),
            sections = view.$el.find('section');

        expect(listItems.first().hasClass('active')).toBe(true);
        expect(sections.first().hasClass('active')).toBe(true);

        listItems.last().find('a').click();
        expect(listItems.first().hasClass('active')).toBe(false);
        expect(sections.first().hasClass('active')).toBe(false);
        expect(listItems.last().hasClass('active')).toBe(true);
        expect(sections.last().hasClass('active')).toBe(true);
      });
    });

    it('should generate sections for all tabs', function () {
      var view = new TabView({
        tabs: [
          { title: 'Tab 1' },
          { title: 'Tab 2' }
        ],
        model: new Model({ activeIndex: 0 })
      });

      jasmine.renderView(view, function () {
        var sections = view.$el.find('section');

        expect(sections.length).toEqual(2);
        expect(sections.first().hasClass('active')).toBe(true);
      });
    });

  });

});
