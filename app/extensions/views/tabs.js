define(['extensions/views/view'],
function (View) {
    return View.extend({
        initialize: function () {
            View.prototype.initialize.apply(this, arguments);
            this.model.on("change:" + this.attr, this.render, this);
        },
        
        events: {
            "click li": "onTabClick"
        },
        
        onTabClick: function (event) {
            var tabId = $(event.currentTarget).data('tab-id');
            this.model.set(this.attr, tabId);
            event.preventDefault();
        },
        
        render: function () {
          console.log("render me up");
            this.$el.find('ul').remove();
            this.$el.append('<ul>');
            _.each(this.tabs, function (tab, index) {
                var tabHtml = "<li><a href='#'>" + tab.name + "</a></li>";
                if (tab.id === this.model.get(this.attr)) {
                    tabHtml = '<li class="active">' + tab.name + "</li>";
                }
                this.$el.find('ul').append($(tabHtml).data('tab-id', tab.id));
            }, this);
        }
    });
});

