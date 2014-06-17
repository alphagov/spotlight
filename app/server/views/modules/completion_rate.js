var requirejs = require('requirejs');

var template = requirejs('stache!common/templates/visualisations/completion');
var View = requirejs('common/views/visualisations/completion_rate');

module.exports = View.extend({

  template: template,

  views: function () {
    var views = View.prototype.views.apply(this, arguments);
    delete views['.volumetrics-completion'];
    return views;
  }

});