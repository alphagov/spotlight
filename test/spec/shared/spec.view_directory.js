define([
  'view_directory',
  'extensions/models/model',
  'common/views/dashboard',
  'common/views/error404',
  'common/views/error500'
],
function (ViewDirectory, Model, DashboardView, Error404View, Error500View) {
  describe("ViewDirectory", function () {

    describe("viewFromStagecraftResponse", function () {
      var directory = new ViewDirectory();

      it("returns a dashboard view for page-type 'dashboard'", function () {
          var model = new Model({
            'page-type': 'dashboard'
          });
          expect(directory.viewFromStagecraftResponse(model)).toBe(DashboardView);
      });

      it("returns an error 404 for stagecraft errors", function () {
          var model = new Model({
            error: 'some error'
          });
          expect(directory.viewFromStagecraftResponse(model)).toBe(Error404View);
      });

      it("returns an error 500 for unknown page types", function () {
          var model = new Model({
            'page-type': 'not implemented'
          });
          expect(directory.viewFromStagecraftResponse(model)).toBe(Error500View);
      });
    });
  });
});
