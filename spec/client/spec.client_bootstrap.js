define([
  'client/client_bootstrap',
  'client/controllers/dashboard'
],
function (bootstrap, DashboardController) {
  describe('client bootstrap', function () {

    var config;
    beforeEach(function () {
      spyOn(DashboardController.prototype, 'render');
      config = {
        'page-type': 'dashboard'
      };
    });

    it('instantiates a controller from config data', function () {
      var controller = bootstrap(config);

      expect(controller instanceof DashboardController).toBe(true);
      expect(controller.render).toHaveBeenCalled();
    });

    it('executes page preprocessors', function () {
      var originalPreprocessors = bootstrap.preprocessors;
      bootstrap.preprocessors = [
        jasmine.createSpy(),
        jasmine.createSpy()
      ];

      bootstrap(config);
      expect(bootstrap.preprocessors[0]).toHaveBeenCalled();
      expect(bootstrap.preprocessors[1]).toHaveBeenCalled();

      bootstrap.preprocessors = originalPreprocessors;
    });
  });
});
