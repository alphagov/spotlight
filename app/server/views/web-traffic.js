var ServicesView = require('./services');
var path = require('path');

var contentTemplate = path.resolve(__dirname, '../templates/web-traffic.html');

module.exports = ServicesView.extend({

  heading: 'Web traffic dashboards',
  example: 'Cabinet Office',

  initialize: function () {
    ServicesView.prototype.initialize.apply(this, arguments);
    this.contentTemplate = contentTemplate;
  },

  getPageTitle: function () {
    return 'Web traffic - GOV.UK';
  }

});