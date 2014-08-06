var ServicesView = require('./services');

module.exports = ServicesView.extend({

  templatePath: '../templates/web-traffic.html',

  getPageTitle: function () {
    return 'Web traffic - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [
      {'path': '/performance', 'title': 'Performance'},
      {'title': 'Web traffic'}
    ];
  }

});