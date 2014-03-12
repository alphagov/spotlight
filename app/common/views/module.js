define([
  'extensions/views/view',
  'tpl!common/templates/module.html'
],
function (View, template) {

  var ModuleView = View.extend({
    template: template,
    tagName: 'section',

    ariaId: function () {
      function safeId(s) {
        if (s.indexOf(' ') === -1) {
          return s;
        }
        return s.replace(/ /g, '-');
      }
      return safeId(this.model.get('title') + '-heading');
    },

    attributes: function () {
      return {
        'aria-labelledby': this.ariaId(),
        'role': 'region'
      };
    },

    views: function () {
      if (isServer && this.requiresSvg) {
        return {};
      }
      return {
        '.visualisation': function () {
          return this.visualisationClass;
        }
      };
    },

    render: function () {
      View.prototype.render.apply(this, arguments);

      if (this.model.get('restricted_data') === true) {
        this.$el.addClass('module-banner restricted-data-banner');
      }
    },

    templateContext: function () {
      return _.extend(
        View.prototype.templateContext.call(this),
        {
          fallback: isServer && this.requiresSvg,
          fallbackUrl: this.url + '.png'
        }
      );
    }
  });

  return ModuleView;
});
