define([
  'extensions/views/view',
  'stache!common/templates/visualisations/list'
],
function (View, template) {

  var ListView = View.extend({

    template: template,
    templateContext: function () {
      var labelAttr = this.collection.options.labelAttr,
          linkAttr = this.collection.options.linkAttr,
          urlRoot = this.collection.options.urlRoot || '',
          labelRegexString = this.collection.options.labelRegex,
          labelRegex = labelRegexString ? new RegExp(labelRegexString) : null;

      var items = this.collection.first().get('values').map(function (item) {
        var label = item.get(labelAttr),
            labelRegexMatch = labelRegex ? labelRegex.exec(label) : null;

        if (labelRegexMatch) {
          label = labelRegexMatch[1];
        } else if (labelRegex && !labelRegexMatch) {
          console.warn('[ListView] Label "' + label + '" does not match regex "' + labelRegexString + '"');
        }

        return {
          'label': label,
          'link': linkAttr ? (urlRoot + item.get(linkAttr)) : null
        };
      }, this);

      return { 'items': items };
    }

  });

  return ListView;

});
