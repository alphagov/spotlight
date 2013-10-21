define(['app/support/backdrop_stub/backdrop_stub_controller.js', 'fs'],
function (backdrop_stub_controller, fs) {

  describe("backdrop stub", function () {

    it("respond with the relevant json file", function () {
      var stub = new backdrop_stub_controller({});
      var json_response = fs.readFileSync('app/support/backdrop_stub/responses/licensing_realtime.json');
      var params = {
        'service': 'licensing',
        'api_name': 'realtime'
      }
      var request = { param: function(key) {
        return params[name];
      } };
      var response = jasmine.createSpyObj('response', ['json']);

      stub.invoke(request, response);

      expect(response.json).toHaveBeenCalledWith(JSON.parse(json_response));
    });

  });

});
