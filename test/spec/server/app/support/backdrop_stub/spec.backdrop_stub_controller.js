define([
  'app/support/backdrop_stub/backdrop_stub_controller.js',
  'fs'
],
function (backdrop_stub_controller, fs) {
  describe("backdrop_stub_controller", function () {
    describe("when there is a mapped JSON response", function () {
      it("responds with the relevant JSON file", function () {
        var json_response = fs.readFileSync(path.join('app/support/backdrop_stub/responses', 'licensing_realtime.json'));
        var params = {
          'service': 'licensing',
          'api_name': 'realtime'
        };
        var request = { param: function(key) {
          return params[key];
        } };

        var response = jasmine.createSpyObj('response', ['json', 'status']);
        backdrop_stub_controller(request, response);

        expect(response.json).toHaveBeenCalledWith(JSON.parse(json_response));
      });
    });

    describe("when there is no relevant JSON response", function () {
      it("responds with a 404 Not Found", function () {
        var params = {
          'service': 'blagh',
          'api_name': 'nonsense'
        };
        var request = { param: function(key) {
          return params[key];
        } };

        var response = jasmine.createSpyObj('response', ['json', 'status']);
        backdrop_stub_controller(request, response);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledWith({error: "no matching response found"});
      });
    });

  });

});
