var requirejs = require('requirejs');
var Backbone = require('backbone');
var ServicesCollection = requirejs('common/collections/services');
var ServicesView = require('../../../app/server/views/services');
var WebTrafficView = require('../../../app/server/views/web-traffic');
var webtrafficController = require('../../../app/server/controllers/web-traffic');

var TableView = requirejs('extensions/views/table');

describe('Web traffic View', function () {

  var view, model, collection;

  beforeEach(function () {
    model = new Backbone.Model({
      axesOptions: webtrafficController.axesOptions.axes
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
    }], webtrafficController.axesOptions);

    view = new WebTrafficView({
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
      spyOn(WebTrafficView.prototype, 'loadTemplate');
    });

    xit('instantiates a TableView', function () {
      view.getContent();
      expect(TableView.prototype.initialize).toHaveBeenCalled();
    });

    xit('renders the TableView into the template', function () {
      view.getContent();
      var options = view.loadTemplate.mostRecentCall.args[1];
      expect(options.table).toEqual('<div id="list"></div>');
    });

  });

});
