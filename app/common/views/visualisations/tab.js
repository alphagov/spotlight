define([
  'extensions/views/view'
],
function (View) {

  var TabView = View.extend({

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change:activeIndex', this.setActiveTab, this);
    },

    events: {
      'click nav a': 'onTabClick'
    },

    onTabClick: function (event) {
      var activeIndex = this.$el.find('a').index(event.currentTarget);
      this.model.set('activeIndex', activeIndex);

      event.preventDefault();
    },

    setActiveTab: function () {
      var activeIndex = this.model.get('activeIndex'),
          listItems = this.$el.find('li'),
          sections = this.$el.find('section');
      listItems.removeClass('active');
      sections.removeClass('active');
      listItems.eq(activeIndex).addClass('active');
      sections.eq(activeIndex).addClass('active');
    },

    render: function () {
      this.setActiveTab();
    }

  });

  return TabView;

});
