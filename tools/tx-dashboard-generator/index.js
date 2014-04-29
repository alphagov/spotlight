var GoogleClientLogin = require('googleclientlogin').GoogleClientLogin;
var GoogleSpreadsheets = require('google-spreadsheets');
var _ = require('underscore');
var fs = require('fs');
var rimraf = require('rimraf');

var googleAuth = new GoogleClientLogin({
  email: 'email@digital.cabinet-office.gov.uk',
  password: 'password',
  service: 'spreadsheets',
  accountType: GoogleClientLogin.accountTypes.google
});

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
          output.strapline = 'Dashboard';
          addField(row.description1, output, 'description');
          addField(row.nameofservice, output, 'title');
          output.department = {};
          addField(row.department, output.department, 'title');
          output.agency = {};
          addField(row.agencybody, output.agency, 'title');
          if (!_.isObject(row.url)) {
            output.relatedPages = {};
            output.relatedPages.transaction = {};
            addField(row.nameofservice, output.relatedPages.transaction, 'title');
            addField(row.url, output.relatedPages.transaction, 'url');
          }
          addField(row.description2, output, 'description-extra');
          addField(row.customertype, output, 'customer-type');
          addField(row.businessmodel, output, 'business-model');
          addField(row.notesoncosts, output, 'costs');
          addField(row.othernotes, output, 'costs-notes');
          output.modules = [];

          //add kpi modules
          output.modules.push({
            'slug': 'transactions-per-year',
            'module-type': 'kpi',
            'title': 'Transactions per year',
            'data-group': 'transactions-explorer',
            'data-type': 'spreadsheet',
            'classes': 'cols3',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:seasonally-adjusted'],
              'sort_by': '_timestamp:descending'
            },
            'value-attribute': 'number_of_transactions',
            'format': { 'type': 'number', 'magnitude': true, 'sigfigs': 3 }
          },
          {
            'slug': 'total-cost',
            'module-type': 'kpi',
            'title': 'Total cost',
            'data-group': 'transactions-explorer',
            'data-type': 'spreadsheet',
            'classes': 'cols3',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:seasonally-adjusted'],
              'sort_by': '_timestamp:descending'
            },
            'value-attribute': 'total_cost',
            'format': { 'type': 'currency', 'magnitude': true, 'sigfigs': 3 }
          },
          {
            'slug': 'cost-per-transaction',
            'module-type': 'kpi',
            'title': 'Cost per transaction',
            'data-group': 'transactions-explorer',
            'data-type': 'spreadsheet',
            'classes': 'cols3',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:seasonally-adjusted'],
              'sort_by': '_timestamp:descending'
            },
            'value-attribute': 'cost_per_transaction',
            'format': { 'type': 'currency', 'pence': true }
          });

          //add transactions per quater
          output.modules.push({
            'slug': 'transactions-per-quarter',
            'module-type': 'bar_chart_with_number',
            'title': 'Transactions per quarter',
            'description': 'Total number of transactions each quarter',
            'data-group': 'transactions-explorer',
            'data-type': 'spreadsheet',
            'value-attribute': 'number_of_transactions',
            'axis-period': 'quarter',
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:quarterly']
            }
          });

          //add digital-take-up
          output.modules.push({
            'slug': 'digital-take-up-per-quater',
            'module-type': 'bar_chart_with_number',
            'title': 'Digital Take-up',
            'description': 'Digital take-up for each quater',
            'data-group': 'transactions-explorer',
            'data-type': 'spreadsheet',
            'value-attribute': 'digital_takeup',
            'axis-period': 'quarter',
            'format': { 'type': 'percent' },
            'axes': {
              'y': [{'label': 'Percentage digital takeup'}]
            },
            'query-params': {
              'filter_by': ['service_id:' + output.slug, 'type:quarterly']
            }
          });

          fs.writeFileSync('./dashboards/' + row.slug + '.json', JSON.stringify(output, null, 2));
        });


      });
    });
});

googleAuth.login();
