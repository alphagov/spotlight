var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/visualisations/bar_chart_with_number');
var templatePath = path.resolve(__dirname, '../../templates/modules/bar_chart_with_number.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache',

  views: function () {
    var views = View.prototype.views.apply(this, arguments);
    delete views['.bar'];
    return views;
  }

});
