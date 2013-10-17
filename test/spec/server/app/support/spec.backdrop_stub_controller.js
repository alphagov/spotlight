//define(['../../../support/backdrop_stub/backdrop_stub_controller.js', 'fs'],
//function (backdrop_stub_controller, fs) {
//
//  describe("backdrop stub", function () {
//
//    it("respond with the relevant json file", function () {
//      var json_response = fs.readFileSync('features/backdrop_stub_responses/licensing_realtime.json');
//      var request = 'not important',
//          response = jasmine.createSpyObj('response', ['send']);
//
//      backdrop_stub_controller(request, response);
//
//      expect(response.send).toHaveBeenCalledWith(json_response);
//    });
//
//  });
//
//});
