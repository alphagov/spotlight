var requirejs = require('requirejs');
var Backbone = require('backbone');

var ServicesView = require('../../../app/server/views/services');

var BaseView = require('../../../app/server/views/govuk');
var FilteredListView = requirejs('common/views/filtered_list');

describe('Services View', function () {

  var view, model, collection;

  beforeEach(function () {
    model = new Backbone.Model();
    collection = new Backbone.Collection();
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

  describe('getContent', function () {

    beforeEach(function () {
      spyOn(FilteredListView.prototype, 'initialize');
      spyOn(FilteredListView.prototype, 'render').andCallFake(function () {
        this.html = '<div id="filtered_list" />';
      });
      spyOn(ServicesView.prototype, 'loadTemplate');
    });

    it('instantiates a FilteredListView', function () {
      view.getContent();
      expect(FilteredListView.prototype.initialize).toHaveBeenCalledWith({
        model: model,
        collection: collection
      });
    });

    it('renders the FilteredListView into the template', function () {
      view.getContent();
      var options = view.loadTemplate.mostRecentCall.args[1];
      expect(options.list).toEqual('<div id="filtered_list" />');
    });

  });

});