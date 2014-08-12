var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/visualisations/visitors-realtime');
var templatePath = path.resolve(__dirname, '../../templates/modules/visitors-realtime.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache',

  templateContext: function () {

    var value = this.getCurrentVisitors();
    var label;

    if (value === null) {
      value = this.noDataMessage;
      label = '';
    } else {
      label = this.format(value, { type: 'plural', singular: 'user' }) + ' online now';
    }

    return _.extend(View.prototype.templateContext.apply(this, arguments), {
      value: value,
      label: label
    });

  }

});