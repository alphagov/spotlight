var requirejs = require('requirejs');
var Backbone = require('backbone');

var AboutView = require('../../../app/server/views/about');

var BaseView = requirejs('common/views/govuk');

describe('About View', function () {

  var view, model, collection;

  beforeEach(function () {
    model = new Backbone.Model();
    collection = new Backbone.Collection();
    view = new AboutView({
      model: model,
    });
  });

  it('extends govuk view', function () {
    expect(view instanceof BaseView).toBe(true);
  });

  describe('getPageTitle', function () {

    it('returns about page title', function () {
      expect(view.getPageTitle()).toEqual('About Performance - GOV.UK');
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
        title: 'About'
      });
    });

  });
});
