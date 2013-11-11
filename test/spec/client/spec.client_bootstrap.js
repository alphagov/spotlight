define([
  'client/client_bootstrap',
  'extensions/controllers/dashboard'
],
function (bootstrap, DashboardController) {
  describe("client bootstrap", function () {

    it("instantiates a controller from config data", function () {
      spyOn(DashboardController.prototype, "render");
      var config = {
        'page-type': 'dashboard'
      };

      var controller = bootstrap(config);

      expect(controller instanceof DashboardController).toBe(true);
      expect(controller.render).toHaveBeenCalled();
    });

    it("executes page preprocessors", function () {
      var originalPreprocessors = bootstrap.preprocessors;
      bootstrap.preprocessors = [
        jasmine.createSpy(),
        jasmine.createSpy()
      ];

      var controller = bootstrap({});
      expect(bootstrap.preprocessors[0]).toHaveBeenCalled();
      expect(bootstrap.preprocessors[1]).toHaveBeenCalled();

      bootstrap.preprocessors = originalPreprocessors;
    });
  });
});
