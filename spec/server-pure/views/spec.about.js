var Backbone = require('backbone');

var AboutView = require('../../../app/server/views/about');

var BaseView = require('../../../app/server/views/govuk');

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

});
