define([
  'extensions/views/view',
  'tpl!common/templates/module.html',
  'extensions/views/graph/table'
],
function (View, template, GraphTable) {

  var ModuleView = View.extend({
    template: template,
    tagName: 'section',

    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);

      // apply default attributes to elements
      if (options.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) {
          attrs.id = _.result(this, 'id');
        }
        this.$el.attr(attrs);
        if (this.className) {
          this.$el.addClass(_.result(this, 'className'));
        }
      }
    },

    ariaId: function () {
      function safeId(s) {
        if (s.indexOf(' ') === -1) {
          return s;
        }
        return s.replace(/ /g, '-');
      }
      return safeId(this.model.get('slug') + '-heading');
    },

    attributes: function () {
      return {
        'aria-labelledby': this.ariaId(),
        'role': 'region'
      };
    },

    views: function () {
      var views = (this.hasTable && this.collection && this.collection.options && this.collection.options.axes) ? {
        '.visualisation-table': {
          view: GraphTable,
          options: this.visualisationOptions
        }
      } : {};
      if (isServer && this.requiresSvg) {
        return views;
      }

      return _.extend(views, {
        '.visualisation-inner': {
          view: this.visualisationClass,
          options: this.visualisationOptions
        }
      });
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
    },

    templateContext: function () {
      if (this.collection) {
        this.jsonUrl = this.collection.url();
      }
      return _.extend(
        View.prototype.templateContext.call(this),
        {
          fallback: isServer && this.requiresSvg,
          fallbackUrl: this.url ? (this.url + '.png') : null,
          jsonUrl: this.jsonUrl,
          hasTable: this.hasTable,
          offerPng: this.requiresSvg
        }
      );
    }

  });

  return ModuleView;
});
