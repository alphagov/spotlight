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
      number_of_transactions: 2000
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
      expect(view.getPageTitle()).toEqual('Our performance - GOV.UK');
    });

  });

  describe('formatKpis', function () {

    it('replaces kpi values with formatted versions', function () {
      view.formatKpis(services);
      expect(services[0].completion_rate).toEqual('40.0%');
    });

  });

});
