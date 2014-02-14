define([
  'extensions/views/view',
  'stache!common/templates/visualisations/list'
],
function (View, template) {

  var ListView = View.extend({

    template: template,
    templateContext: function() {
      var items = this.collection.map(function(item) {
        var labelAttr = this.collection.options['label-attr'],
            linkAttr = this.collection.options['link-attr'],
            urlRoot = this.collection.options['url-root'] || '';

        return {
          "label": item.get(labelAttr),
          "link": linkAttr ? (urlRoot + item.get(linkAttr)) : null
        };
      }, this);

      return { "items": items };
    }

  });

  return ListView;

});
