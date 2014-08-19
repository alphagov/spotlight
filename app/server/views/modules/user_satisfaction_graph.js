var path = require('path');

var View = require('./completion_rate');
var templatePath = path.resolve(__dirname, '../../templates/modules/user-satisfaction-graph.html');

module.exports = View.extend({

  templatePath: templatePath,

  templateContext: function () {
    return {
      hasBarChart: this.model.get('parent').get('page-type') === 'module'
    };
  }

});