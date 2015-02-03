var requirejs = require('requirejs');
var Backbone = require('backbone');
var ServicesCollection = requirejs('common/collections/services');
var ServicesView = require('../../../app/server/views/services');
var servicesController = require('../../../app/server/controllers/services');

var BaseView = require('../../../app/server/views/govuk');
var TableView = requirejs('extensions/views/table');

describe('Services View', function () {

  var view, model, collection;

  beforeEach(function () {
    model = new Backbone.Model({
      axesOptions: servicesController.serviceAxes.axes
    });
    collection = new ServicesCollection([], servicesController.serviceAxes);
    view = new ServicesView({
      model: model,
      collection: collection
    });
  });

  it('extends govuk view', function () {
    expect(view instanceof BaseView).toBe(true);
  });

  describe('getPageTitle', function () {

    it('returns services page title', function () {
      expect(view.getPageTitle()).toEqual('Services - GOV.UK');
    });

  });

  describe('getBreadcrumbCrumbs', function () {

    it('returns breadcrumbs', function () {
      expect(view.getBreadcrumbCrumbs().length).toEqual(2);
      expect(view.getBreadcrumbCrumbs()[0]).toEqual({
        path: '/performance',
        title: 'Performance'
      });
      expect(view.getBreadcrumbCrumbs()[1]).toEqual({
        title: 'Service dashboards'
      });
    });

  });

  describe('getContent', function () {

    beforeEach(function () {
      spyOn(TableView.prototype, 'initialize');
      spyOn(TableView.prototype, 'render').andCallFake(function () {
        this.$el.html('<div id="list"></div>');
      });
      spyOn(ServicesView.prototype, 'loadTemplate');
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