var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/visualisations/column');
var templatePath = path.resolve(__dirname, '../../templates/modules/column.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache',

  templateContext: function () {
    return {
      label: this.collection.options.axes.x.label
    };
  }

});
