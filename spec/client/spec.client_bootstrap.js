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
      $('body').removeClass('ready loaded');
    });

    it('instantiates a controller from config data', function () {
      var controller = bootstrap(config);

      expect(controller instanceof DashboardController).toBe(true);
      expect(controller.render).toHaveBeenCalled();
    });

    it('executes page preprocessors on controller ready', function () {
      var originalPreprocessors = bootstrap.preprocessors;
      bootstrap.preprocessors = [
        jasmine.createSpy(),
        jasmine.createSpy()
      ];

      var controller = bootstrap(config);

      expect(bootstrap.preprocessors[0]).not.toHaveBeenCalled();
      expect(bootstrap.preprocessors[1]).not.toHaveBeenCalled();
      controller.trigger('ready');
      expect(bootstrap.preprocessors[0]).toHaveBeenCalled();
      expect(bootstrap.preprocessors[1]).toHaveBeenCalled();

      bootstrap.preprocessors = originalPreprocessors;
    });

    it('executes page preprocessors immediately if no controller defined', function () {
      var originalPreprocessors = bootstrap.preprocessors;
      bootstrap.preprocessors = [
        jasmine.createSpy(),
        jasmine.createSpy()
      ];

      bootstrap({
        'page-type': 'no-contoller'
      });

      expect(bootstrap.preprocessors[0]).toHaveBeenCalled();
      expect(bootstrap.preprocessors[1]).toHaveBeenCalled();

      bootstrap.preprocessors = originalPreprocessors;
    });

    it('adds a ready class to the body on controller ready', function () {
      var controller = bootstrap(config);

      expect($('body').hasClass('ready')).toBe(false);
      controller.trigger('ready');
      expect($('body').hasClass('ready')).toBe(true);
    });

    it('adds ready class to body immediately if no controller defined', function () {
      bootstrap({
        'page-type': 'no-contoller'
      });

      expect($('body').hasClass('ready')).toBe(true);
    });
  });
});
