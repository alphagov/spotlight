define(['healthcheck'],
function (healthcheck) {

  describe("Health Check", function () {
    it("should return ok", function () {
      expect(healthcheck()).toEqual({status: "ok"});
    });
  });

});
