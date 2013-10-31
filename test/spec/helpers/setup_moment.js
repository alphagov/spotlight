define([], function () {
  var setupMoment = function (date, anObject) {
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

  return setupMoment;
});
