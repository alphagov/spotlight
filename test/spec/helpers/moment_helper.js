(function() {

  var isMoment = function (m) {
    return jasmine.isA_('Object', m) && jasmine.isA_('Date', m._d);
  };

  var format = function(o) {
    return isMoment(o) ? o.format() : o;
  };

  jasmine.getEnv().addEqualityTester(function(aMoment, anotherMoment) {
    if (isMoment(aMoment) && isMoment(anotherMoment)) {
      return (aMoment.unix() === anotherMoment.unix());
    }
  });

  jasmine.getEnv().beforeEach(function() {
    this.addMatchers({
      toBeMoment: function(expected) {
        var actual = this.actual;
        var notText = this.isNot ? " not" : "";

        this.message = function () {
          return "Expected " + format(actual) + notText + " to be moment " + format(expected);
        };

        return isMoment(actual) && isMoment(expected) && actual.unix() === expected.unix();
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
