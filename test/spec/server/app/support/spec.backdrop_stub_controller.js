define(['app/support/backdrop_stub/backdrop_stub_controller.js', 'fs'],
function (backdrop_stub_controller, fs) {

  describe("backdrop stub", function () {
    describe("when there is a mapped json response", function () {

      it("respond with the relevant json file", function () {
        var json_response = fs.readFileSync(path.join('app/support/backdrop_stub/responses', 'licensing_realtime.json'));
        var params = {
          'service': 'licensing',
          'api_name': 'realtime'
        };
        var request = { param: function(key) {
          return params[key];
        } };

        var response = jasmine.createSpyObj('response', ['json']);
        backdrop_stub_controller(request, response);

        expect(response.json).toHaveBeenCalledWith(JSON.parse(json_response));
      });

    });
    describe("when there no mapped json response", function () {

      it("respond with the relevant json file", function () {
        var params = {
          'service': 'blagh',
          'api_name': 'nonsense'
        };
        var request = { param: function(key) {
          return params[key];
        } };

        var response = jasmine.createSpyObj('response', ['json']);
        backdrop_stub_controller(request, response);

        expect(response.json).toHaveBeenCalledWith({error: "no matching response found"});
      });

    });
  });

});
