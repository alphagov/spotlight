var ServicesView = require('./services');
var path = require('path');

var contentTemplate = path.resolve(__dirname, '../templates/simple-dashboard-list.html');

module.exports = ServicesView.extend({

  initialize: function () {
    this.heading = this.model.get('title');
    this.example = this.model.get('example');
    ServicesView.prototype.initialize.apply(this, arguments);
    this.contentTemplate = contentTemplate;
  },

  getPageTitle: function () {
    return this.model.get('title') + ' - GOV.UK';
  },

  getContent: function() {
    return ServicesView.prototype.getContent.apply(this, arguments);
  }

});
