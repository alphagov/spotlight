var requirejs = require('requirejs');
var Backbone = require('backbone');
var ServicesCollection = requirejs('common/collections/services');
var ServicesView = require('../../../app/server/views/services');
var View = require('../../../app/server/views/simple-dashboard-list');
var controller = require('../../../app/server/controllers/simple-dashboard-list');

var TableView = requirejs('extensions/views/table');

describe('Simple dashboard list view', function () {

  var view, model, collection;

  beforeEach(function () {
    model = new Backbone.Model({
      axesOptions: controller.axesOptions.axes,
      title: 'Web traffic'
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
      }
    }], controller.axesOptions);

    view = new View({
      model: model,
      collection: collection
    });
  });

  it('extends govuk view', function () {
    expect(view instanceof ServicesView).toBe(true);
  });

  describe('getPageTitle', function () {

    it('returns page title', function () {
      expect(view.getPageTitle()).toEqual('Web traffic - GOV.UK');
    });

  });

  describe('getContent', function () {

    beforeEach(function () {
      spyOn(TableView.prototype, 'initialize');
      spyOn(TableView.prototype, 'render').andCallFake(function () {
        this.$el.html('<div id="list"></div>');
      });
      spyOn(View.prototype, 'loadTemplate');
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

});
