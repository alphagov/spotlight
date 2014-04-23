define([
  'backbone',
  'page_config',
  'extensions/controllers/controller',
  'common/views/homepage'
],
function (Backbone, PageConfig, Controller, HomepageView) {

  var HomepageController = Controller.extend({
    viewClass: HomepageView
  });

  var homepage = function (req, res) {
    var model = new Backbone.Model();

    model.set(PageConfig.commonConfig(req));

    // We should fetch this information from Stagecraft!
    var detailedDashboardColumns = [
      [
        {
          title: 'C',
          services: [
            {name: 'Carer\'s Allowance', slug: 'carers-allowance'}
          ]
        },
        {
          title: 'G',
          services: [
            {name: 'G-Cloud', slug: 'g-cloud'}
          ]
        },
        {
          title: 'L',
          services: [
            {name: 'Lasting Power of Attorney', slug: 'lasting-power-of-attorney'},
            {name: 'Licensing', slug: 'licensing'}
          ]
        }
      ],
      [
        {
          title: 'P',
          services: [
            {name: 'Pay to get documents legalised by post', slug: 'pay-legalisation-post'},
            {name: 'Pay to legalise documents using the premium service', slug: 'pay-legalisation-drop-off'},
            {name: 'Payment for certificates to get married abroad', slug: 'pay-foreign-marriage-certificates'},
            {name: 'Payment to register a birth abroad in the UK', slug: 'pay-register-birth-abroad'},
            {name: 'Payment to register a death abroad', slug: 'pay-register-death-abroad'}
          ]
        }
      ],
      [
        {
          title: 'R',
          services: [
            {name: 'Register as a waste carrier, broker or dealer', slug: 'waste-carrier-or-broker-registration'}
          ]
        },
        {
          title: 'S',
          services: [
            {name: 'SORN (Statutory Off Road Notification)', slug: 'sorn'}
          ]
        },
        {
          title: 'T',
          services: [
            {name: 'Tax disc', slug: 'tax-disc'}
          ]
        },
        {
          title: 'Service groups',
          services: [
            {name: 'Vehicle licensing', slug: 'vehicle-licensing'}
          ]
        }
      ]
    ];

    _.each(detailedDashboardColumns, function (column) {
      _.each(column, function (group) {
        group.sanitised_title = group.title.toLowerCase().replace(' ', '_');
      });
    });

    model.set('detailedDashboardColumns', detailedDashboardColumns);

    var homepageController = new HomepageController({
      model: model,
      raw: req.query.raw,
      url: req.originalUrl
    });

    homepageController.render();

    res.send(homepageController.html);
  };

  return homepage;
});
