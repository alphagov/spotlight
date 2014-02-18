define([
  'extensions/views/view',
  'stache!common/templates/visualisations/list'
],
function (View, template) {

  var ListView = View.extend({

    template: template,
    templateContext: function() {
      var items = this.collection.first().get('values').map(function(item) {
        var labelAttr = this.collection.options.labelAttr,
            linkAttr = this.collection.options.linkAttr,
            urlRoot = this.collection.options.urlRoot || '';

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
