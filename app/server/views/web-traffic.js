var ServicesView = require('./services');

module.exports = ServicesView.extend({

  heading: 'Web traffic dashboards',
  tagline: 'Web traffic dashboards providing performance data from GOV.UK',
  example: 'Cabinet Office',

  getPageTitle: function () {
    return 'Web traffic - GOV.UK';
  }

});