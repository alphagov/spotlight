define([
  'extensions/views/view',
  'tpl!common/templates/module-error.html'
], function (View, Template) {

  return View.extend({

    tagName: 'section',

    template: Template,

    templateContext: function () {
      return _.extend(
        View.prototype.templateContext.call(this),
        {
          url: this.url,
          pageType: this.model.get('parent').get('page-type')
        }
      );
    },

    ariaId: function () {
      function safeId(s) {
        if (s.indexOf(' ') === -1) {
          return s;
        }
        return s.replace(/ /g, '-');
      }
      return safeId(this.model.get('slug') + '-heading');
    }

  });

});