define([
  'extensions/views/view',
  'stache!common/templates/visualisations/tab'
],
function (View, template) {

  var TabView = View.extend({

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      this.activeIndex = 0;
    },

    events: {
      'click nav a': 'onTabClick'
    },

    template: template,
    templateContext: function () {
      return {
        tabs: this.tabs 
      };
    },

    // rearrange where activeIndex gets set so that ti is in setActiveTab
    // and hope render only gets called once

    onTabClick: function (event) {
      this.activeIndex = this.$el.find('a').index(event.currentTarget);
      this.setActiveTab(this.activeIndex);

      event.preventDefault();
    },

    setActiveTab: function (activeIndex) {
      var listItems = this.$el.find('li'),
          sections = this.$el.find('section');
      listItems.removeClass('active');
      sections.removeClass('active');
      listItems.eq(activeIndex).addClass('active');
      sections.eq(activeIndex).addClass('active');
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      this.setActiveTab(this.activeIndex);
    },

    getModuleElementBySlug: function(slug) {
      var tabs = this.tabs
          tabIndex;

      console.log('getModuleElementBySlug', slug, tabs);

      for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
        if (tabs[tabIndex].slug === slug) break;
      }

      var element = this.$el.find('section').eq(tabIndex);
      return element;
    }

  });

  return TabView;

});
