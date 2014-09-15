var BaseView = require('../../../app/server/views/govuk');
var HomePageView = require('../../../app/server/views/homepage');

/*this is not a controller test*/
describe('Homepage', function () {

  var view;

  beforeEach(function () {
    view = new HomePageView();
  });

  it('extends govuk view', function () {
    expect(view instanceof BaseView).toBe(true);
  });

  describe('hasSurvey', function () {

    it('Should display our survey', function () {
      expect(view.hasSurvey()).toBe(true);
    });

  });

});
