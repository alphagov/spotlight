var requirejs = require('requirejs');

var View = require('./completion_rate');
var template = requirejs('stache!common/templates/visualisations/user-satisfaction-graph');

module.exports = View.extend({

  template: template,

  templateContext: function () {
    return {
      hasBarChart: this.model.get('parent').get('page-type') === 'module'
    };
  }

});