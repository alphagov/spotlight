var GoogleClientLogin = require('googleclientlogin').GoogleClientLogin;
var GoogleSpreadsheets = require('google-spreadsheets');
var _ = require('underscore');
var fs = require('fs');
var rimraf = require('rimraf');
var googleCredentials = require('./config.json');

var googleAuth = new GoogleClientLogin(_.extend({
  email: 'email@digital.cabinet-office.gov.uk',
  password: 'password',
  service: 'spreadsheets',
  accountType: GoogleClientLogin.accountTypes.google
}, googleCredentials));

var redirects = ['source,destination'],
  txUrl = '/performance/transactions-explorer/service-details/',
  spotlightUrl = '/performance/';

googleAuth.on(GoogleClientLogin.events.login, function () {
  GoogleSpreadsheets.rows({
    key: '0AiLXeWvTKFmBdFpxdEdHUWJCYnVMS0lnUHJDelFVc0E',
    auth: googleAuth.getAuthId(),
    worksheet: 1,
    sq: '"high-volume"=yes'
  }, function (err, spreadsheet) {
      if (err) {
        throw new Error(err);
      }

      rimraf('./dashboards', function () {
        fs.mkdirSync('./dashboards');

        _.each(spreadsheet, function (row) {

          function addField(value, obj, key) {
            if (!_.isObject(value)) {
              obj[key] = value.trim();
            }
          }

          var output = {};
          output.slug = row.slug;
          output['page-type'] = 'dashboard';
          output['dashboard-type'] = 'high-volume-transaction';
          output['published'] = true;
          output.strapline = 'Dashboard';
          addField(row.description1, output, 'description');
          addField(row.nameofservice, output, 'title');
          output.department = {};
          addField(row.department, output.department, 'title');
          addField(row.abbr, output.department, 'abbr');
          if (row.agencybody !== row.department) {
            output.agency = {};
            addField(row.agencybody, output.agency, 'title');
            addField(row.agencyabbr, output.agency, 'abbr');
          }
          output.relatedPages = {
            'improve-dashboard-message': true
          };
          if (!_.isObject(row.url)) {
            output.relatedPages.transaction = {};
            addField(row.nameofservice, output.relatedPages.transaction, 'title');
            addField(row.url, output.relatedPages.transaction, 'url');
          }
          addField(row.description2, output, 'description-extra');
          addField(row.customertype, output, 'customer-type');
          addField(row.businessmodel, output, 'business-model');
          addField(row.notesoncosts, output, 'costs');
          addField(row.othernotes, output, 'other-notes');
          output.modules = [];

          var totalCost = {
            'slug': 'total-cost',
            'module-type': 'kpi',
            'title': 'Total cost',
            'data-group': 'transactional-services',
            'data-type': 'summaries',
            'classes': 'cols3',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:seasonally-adjusted'],
              'sort_by': '_timestamp:descending'
            },
            'value-attribute': 'total_cost',
            'format': { 'type': 'currency', 'magnitude': true, 'sigfigs': 3 }
          };

          var costPerTrans = {
            'slug': 'cost-per-transaction',
            'module-type': 'kpi',
            'title': 'Cost per transaction',
            'data-group': 'transactional-services',
            'data-type': 'summaries',
            'classes': 'cols3',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:seasonally-adjusted'],
              'sort_by': '_timestamp:descending'
            },
            'value-attribute': 'cost_per_transaction',
            'format': { 'type': 'currency', 'pence': true }
          };

          if (!_.isObject(row.notesoncosts)) {
            totalCost.info = [
              row.notesoncosts,
              '<br />',
              'Data source: ' + row.department,
              'Total cost is the overall cost per year of providing a service, including staff, IT and accommodation costs; the total cost is automatically calculated from volume and cost per transaction figures, and some rounding errors may occur.'
            ];

            costPerTrans.info = [
              row.notesoncosts,
              '<br />',
              'Data source: ' + row.department,
              '<a href="https://www.gov.uk/service-manual/measurement/cost-per-transaction.html">Cost per transaction</a> is the average cost of providing each successfully completed transaction, across all channels. Staff, IT and accommodation costs should be included.'
            ];
          } else {
            totalCost.info = [
              'Data source: ' + row.department,
              'Total cost is the overall cost per year of providing a service, including staff, IT and accommodation costs; the total cost is automatically calculated from volume and cost per transaction figures, and some rounding errors may occur.'
            ];

            costPerTrans.info = [
              'Data source: ' + row.department,
              '<a href="https://www.gov.uk/service-manual/measurement/cost-per-transaction.html">Cost per transaction</a> is the average cost of providing each successfully completed transaction, across all channels. Staff, IT and accommodation costs should be included.'
            ];
          }

          //add kpi modules
          output.modules.push({
            'slug': 'transactions-per-year',
            'module-type': 'kpi',
            'title': 'Transactions per year',
            'data-group': 'transactional-services',
            'data-type': 'summaries',
            'classes': 'cols3',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:seasonally-adjusted'],
              'sort_by': '_timestamp:descending'
            },
            'value-attribute': 'number_of_transactions',
            'format': { 'type': 'number', 'magnitude': true, 'sigfigs': 3 },
            'info': [
              'Data source: ' + row.department
            ]
          }, totalCost, costPerTrans);

          //add transactions per quarter
          output.modules.push({
            'slug': 'transactions-per-quarter',
            'module-type': 'bar_chart_with_number',
            'title': 'Transactions per quarter',
            'description': 'Total number of transactions each quarter',
            'data-group': 'transactional-services',
            'data-type': 'summaries',
            'value-attribute': 'number_of_transactions',
            'axis-period': 'quarter',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:quarterly']
            },
            'info': [
              'Data source: ' + row.department
            ]
          });

          //add digital-take-up
          output.modules.push({
            'slug': 'digital-take-up-per-quarter',
            'module-type': 'bar_chart_with_number',
            'title': 'Digital take-up',
            'description': 'Digital take-up rates each quarter',
            'data-group': 'transactional-services',
            'data-type': 'summaries',
            'value-attribute': 'digital_takeup',
            'axis-period': 'quarter',
            'format': { 'type': 'percent' },
            'axes': {
              'y': [{'label': 'Percentage digital take-up'}]
            },
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:quarterly']
            },
            'info': [
              'Data source: ' + row.department,
              '<a href="https://www.gov.uk/service-manual/measurement/digital-takeup.html">Digital take-up</a> measures the percentage of completed applications that are made through a digital channel versus non-digital channels.'
            ]
          });

          fs.writeFileSync('./dashboards/' + row.slug + '.json', JSON.stringify(output, null, 2));

          redirects.push([txUrl + row.slug, spotlightUrl + row.slug].join());
        });

        fs.writeFileSync('./redirects.csv', redirects.join('\n'));

      });
    });
});


googleAuth.login();
