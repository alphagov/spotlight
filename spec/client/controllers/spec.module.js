define([
  'client/controllers/module',
  'extensions/controllers/controller',
  'modernizr'
],
function (ModuleController, Controller, Modernizr) {

  describe('ModuleController', function () {

    describe('viewOptions', function () {

      describe('and the derived el is present', function () {
        beforeEach(function () {
          $('<div id="some_id"></div>').appendTo($('body'));
        });

        it('should include the correct element', function () {
          jasmine.clientOnly(function () {
            var moduleController = new ModuleController();
            var id = function () { return 'some_id'; };
            moduleController.id = id;
            expect(moduleController.viewOptions().el).toEqual($('#some_id'));
          });
        });

      });

    });

    describe('render', function () {

      beforeEach(function () {
        spyOn(Controller.prototype, 'render');
      });

      it('does not render in non-SVG browsers when SVG is required', function () {
        Modernizr.inlinesvg = false;
        var moduleController = new ModuleController({
          requiresSvg: true
        });
        var isReady = false;
        moduleController.once('ready', function () {
          isReady = true;
        });
        moduleController.render();
        expect(isReady).toBe(true);
        expect(Controller.prototype.render).not.toHaveBeenCalled();
      });

      it('renders in non-SVG browsers when SVG is not required', function () {
        Modernizr.inlinesvg = false;
        var moduleController = new ModuleController({
          requiresSvg: false
        });
        var isReady = false;
        moduleController.once('ready', function () {
          isReady = true;
        });
        moduleController.render();
        expect(Controller.prototype.render).toHaveBeenCalled();
      });

      it('renders in SVG browsers when SVG is required', function () {
        Modernizr.inlinesvg = true;
        var moduleController = new ModuleController({
          requiresSvg: true
        });
        var isReady = false;
        moduleController.once('ready', function () {
          isReady = true;
        });
        moduleController.render();
        expect(Controller.prototype.render).toHaveBeenCalled();
      });
    });

  });

});
