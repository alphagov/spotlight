define([
  'extensions/controllers/module'
],
function (ModuleController) {

  describe("ModuleController", function () {

    describe("viewOptions", function () {
       
      describe("when isClient is true", function () {
        beforeEach(function () {
          window.isClient = true;
        });

        describe("and the derived el is present", function () {
          beforeEach(function () {
            page = $('<div id="some_id"></div>').appendTo($('body'));
          });

          it("should include the correct element", function () {
            var moduleController = new ModuleController();
            var id = function () { return "some_id"; };
            moduleController.id = id;
            expect(moduleController.viewOptions().el).toEqual($('#some_id'));
          });

        });

      });

    });

  });

});
