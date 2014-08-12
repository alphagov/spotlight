var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/visualisations/availability');
var templatePath = path.resolve(__dirname, '../../templates/modules/availability.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache',

  views: function () {
    var views = View.prototype.views.apply(this, arguments);
    delete views['.uptime-graph'];
    delete views['.response-time-graph'];
    return views;
  }

});
