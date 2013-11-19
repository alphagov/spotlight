(function() {
  function momentEqualityTester(aMoment, anotherMoment) {
    if (moment.isMoment(aMoment) && moment.isMoment(anotherMoment)) {
      return (aMoment.unix() === anotherMoment.unix());
    }
  }

  jasmine.getEnv().addEqualityTester(momentEqualityTester);

  jasmine.getEnv().beforeEach(function() {
    this.addMatchers({
      toBeMoment: function(expected) {
        var actual = this.actual;
        var notText = this.isNot ? " not" : "";

        var format = function(o) {
          return moment.isMoment(o) ? o.format() : o;
        };

        this.message = function () {
          return "Expected " + format(actual) + notText + " to be moment " + format(expected);
        };

        return moment.isMoment(actual) && actual.isSame(expected);
      }
    });
  });

  jasmine.setupMoment = function (date, anObject) {
    spyOn(anObject, "moment");
    anObject.moment.plan = function () {
      var realMoment = anObject.moment.originalValue;
      // set "now" to a fixed date to enable static expectations
      if (!arguments.length) {
        return realMoment(date);
      }
      return realMoment.apply(null, arguments);
    };
  };
})();
