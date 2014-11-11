var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/visualisations/headline-figure');
var templatePath = path.resolve(__dirname, '../../templates/modules/headline-figure.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({
  templatePath: templatePath
});
