var requirejs = require('requirejs');
var Backbone = require('backbone');
var ServicesCollection = requirejs('common/collections/services');
var HomepageView = require('../../../app/server/views/homepage');
var servicesController = require('../../../app/server/controllers/services');

var BaseView = require('../../../app/server/views/govuk');

describe('Homepage View', function () {

  var view, model, services, collection;

  beforeEach(function () {
    model = new Backbone.Model({
      axesOptions: servicesController.serviceAxes.axes
    });

    services = [{
      title: 'Prescriptions: prepayment certificates issued',
      department: {
        title: 'Department of Health',
        abbr: 'DH'
      },
      agency: {
        title: 'NHS Business Services Authority',
        abbr: 'NHSBSA'
      },
      completion_rate: 0.4,
      number_of_transactions: 2000,
      cost_per_transaction: 0.06
    },
      {
        title: 'Carers Allowance',
        department: {
          title: 'Department of Health',
          abbr: 'DH'
        },
        agency: {
          title: 'NHS Business Services Authority',
          abbr: 'NHSBSA'
        },
        completion_rate: 0.8,
        number_of_transactions: 140000,
        cost_per_transaction: 3.46
      }];

    collection = new ServicesCollection(services, servicesController.serviceAxes);

    view = new HomepageView({
      model: model,
      collection: collection
    });
  });

  it('extends govuk view', function () {
    expect(view instanceof BaseView).toBe(true);
  });

  describe('getPageTitle', function () {

    it('returns page title', function () {
      expect(view.getPageTitle()).toEqual('Performance - GOV.UK');
    });

  });

  describe('formatKpis', function () {

    it('replaces kpi values with formatted versions', function () {
      view.formatKpis(services);
      expect(services[0].completion_rate).toEqual('40.0%');
    });

  });

  describe('renderServicesTable', function() {

    it('renders a table for the specified KPI', function() {
      var html = view.renderServicesTable('completion_rate');
      expect(global.$(html).find('tbody tr').length).toEqual(2);
    });

    it('sorts the table in descending order by default', function() {
      var html = view.renderServicesTable('number_of_transactions');
      expect(global.$(html).find('tbody tr:eq(0) [data-key="number_of_transactions"]').text()).toEqual('140,000');
      expect(global.$(html).find('tbody tr:eq(1) [data-key="number_of_transactions"]').text()).toEqual('2,000');
    });

    it('sorts the table in ascending order if specified', function() {
      var html = view.renderServicesTable('cost_per_transaction', 'ascending');
      expect(global.$(html).find('tbody tr:eq(0) [data-key="cost_per_transaction"]').text()).toEqual('£0.06');
      expect(global.$(html).find('tbody tr:eq(1) [data-key="cost_per_transaction"]').text()).toEqual('£3.46');
    });

  });

});
