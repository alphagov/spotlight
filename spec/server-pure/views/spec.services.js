var requirejs = require('requirejs');
var Backbone = require('backbone');
var ServicesCollection = requirejs('common/collections/services');
var ServicesView = require('../../../app/server/views/services');
var servicesController = require('../../../app/server/controllers/services');

var BaseView = require('../../../app/server/views/govuk');
var TableView = requirejs('extensions/views/table');

describe('Services View', function () {

  var view, model, collection, viewOptions;

  beforeEach(function () {
    model = new Backbone.Model({
      axesOptions: servicesController.serviceAxes.axes
    });

    collection = new ServicesCollection([{
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
      digital_takeup: 0
    }], servicesController.serviceAxes);

    viewOptions = {
      model: model,
      collection: collection
    };
  });

  afterEach(function () {
    this.removeAllSpies();
  });

  it('extends govuk view', function () {
    view = new ServicesView(viewOptions);
    expect(view instanceof BaseView).toBe(true);
  });

  describe('getPageTitle', function () {

    it('returns services page title', function () {
      view = new ServicesView(viewOptions);
      expect(view.getPageTitle()).toEqual('Services data - GOV.UK');
    });

  });

  it('does an initial filter on the collection', function () {
    spyOn(collection, 'filterServices').andCallThrough();
    model.set({
      filter: '',
      departmentFilter: 'Department of Health',
      serviceGroupFilter: 'carers-allowance'
    });
    view = new ServicesView(viewOptions);
    expect(collection.filterServices).toHaveBeenCalledWith(jasmine.objectContaining({
      text: '',
      department: 'Department of Health',
      serviceGroup: 'carers-allowance'
    }));
  });

  describe('getContent', function () {

    beforeEach(function () {
      spyOn(TableView.prototype, 'initialize');
      spyOn(TableView.prototype, 'render').andCallFake(function () {
        this.$el.html('<div id="list"></div>');
      });
      spyOn(ServicesView.prototype, 'loadTemplate');

      view = new ServicesView(viewOptions);
    });

    it('instantiates a TableView', function () {
      view.getContent();
      expect(TableView.prototype.initialize).toHaveBeenCalled();
    });

    it('renders the TableView into the template', function () {
      view.getContent();
      var options = view.loadTemplate.mostRecentCall.args[1];
      expect(options.table).toEqual('<div id="list"></div>');
    });

  });

  describe('formatAggregateValues', function () {

    it('adds a formatted value for kpis with a weighted_average', function () {
      expect(view.formatAggregateValues()[0].formattedValue).toEqual('2,000');
    });

    it('ensures all results are present even for ones with no values', function () {
      expect(view.formatAggregateValues()[0].key).toEqual('number_of_transactions');
    });

    describe('with more than one service/transaction', function () {
      beforeEach(function () {
        model = new Backbone.Model({
          axesOptions: servicesController.serviceAxes.axes
        });

        collection = new ServicesCollection([
          {
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
            digital_takeup: 0.5
          },
          {
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
            digital_takeup: 0
          }
        ], servicesController.serviceAxes);

        viewOptions = {
          model: model,
          collection: collection
        };
        view = new ServicesView(viewOptions);
      });

      afterEach(function () {
        this.removeAllSpies();
      });

      it('adds a formatted value for kpis with a weighted_average', function () {
        expect(view.formatAggregateValues()[0].formattedValue).toEqual('4,000');
      });

    });

  });

});
