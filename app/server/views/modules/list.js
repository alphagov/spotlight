var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');
var template = requirejs('stache!common/templates/visualisations/list');

module.exports = View.extend({

  template: template,
  templateContext: function () {
    var labelAttr = this.collection.options.labelAttr,
        linkAttr = this.collection.options.linkAttr,
        urlRoot = this.collection.options.urlRoot || '',
        labelRegexString = this.collection.options.labelRegex,
        labelRegex = labelRegexString ? new RegExp(labelRegexString) : null;

    var items = this.collection.map(function (item) {
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

    return _.extend(View.prototype.templateContext.apply(this, arguments), { 'items': items });
  }

});
