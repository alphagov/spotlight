(function() {

  var isMoment = function (m) {
    return jasmine.isA_('Object', m) && jasmine.isA_('Date', m._d);
  };

  var format = function(o) {
    return isMoment(o) ? o.format() : o;
  };

  var tester = function(aMoment, anotherMoment) {
    if (isMoment(aMoment) && isMoment(anotherMoment)) {
      return (aMoment.unix() === anotherMoment.unix());
    }
  }

  jasmine.addCustomEqualityTester = function(tester) {
    env.addCustomEqualityTester(tester);
  };

  jasmine.getEnv().beforeEach(function() {
    jasmine.addMatchers({

      toBeMoment: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {

            var notText = this.isNot ? " not " : ":";

            var passed = isMoment(actual) && isMoment(expected) && actual.unix() === expected.unix();
            var message = "Expected " + format(actual) + notText + " to be moment " + format(expected);

            return {
              pass: passed,
              message: message
            }
          }
        }
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
