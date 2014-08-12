var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/visualisations/single-timeseries');
var templatePath = path.resolve(__dirname, '../../templates/modules/completion.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache',

  views: function () {
    var views = View.prototype.views.apply(this, arguments);
    delete views['.volumetrics-completion'];
    return views;
  }

});