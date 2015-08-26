define([
],
function () {

  function timeEvents (eventId, requestIds, object, fnName, events, callback) {
    var cachedFn = object[fnName],
        start;

    function endTiming () {
      var diff = process.hrtime(start),
          nanoseconds = diff[0] * 1e9 + diff[1];

      logger.info(
        eventId + ' took %dns',
        nanoseconds,
        _.extend({
          eventId: eventId,
          time: nanoseconds
        }, requestIds)
      );

      object[fnName] = cachedFn;

      if (_.isFunction(callback)) {
        callback(eventId, nanoseconds);
      }
    }

    if (isServer) {
      _.forEach(events, function(eventName) {
        object.once(eventName, endTiming);
      });

      object[fnName] = function () {
        start = process.hrtime();
        cachedFn.apply(object, arguments);
      };
    }
  }

  var Performance = {

    timeIt: function timeIt (eventId, requestIds, fn, callback) {
      if (isServer) {
        var start = process.hrtime(),
            diff, nanoseconds;
        fn();
        diff = process.hrtime(start);
        nanoseconds = diff[0] * 1e9 + diff[1];

        logger.info(
          eventId + ' took %dns',
          nanoseconds, diff[0], diff[1],
          _.extend({
            eventId: eventId,
            time: nanoseconds
          }, requestIds)
        );

        if (_.isFunction(callback)) {
          callback(eventId, nanoseconds);
        }
      } else {
        fn();
      }
    },


    timeCollection: function timeCollection (eventId, requestIds, collection, callback) {
      timeEvents(
        eventId, requestIds,
        collection, 'fetch',
        ['reset', 'error'],
        callback
      );
    },

    timeRender: function timeRender (eventId, requestIds, renderable, callback) {
      timeEvents(
        eventId, requestIds,
        renderable, 'render',
        ['ready'],
        callback
      );
    },

    timerDiff: function timerDiff (diffEventId, requestIds) {
      var waitingFor = 2,
          timings = [];

      return function (eventId, nanoseconds) {
        var diff;

        timings.push({ id: eventId, time: nanoseconds });

        if (--waitingFor === 0) {
          diff = ((timings[0].time - timings[1].time) / timings[1].time) * 100;

          logger.info(
            '%s diff of %s (%dns) and %s (%dns) is %d%',
            diffEventId, timings[0].id, timings[0].time,
            timings[1].id, timings[1].time, diff.toFixed(2),
            _.extend({
              eventId: diffEventId,
              diff: diff,
              eventId0: timings[0].id,
              time0: timings[0].time,
              eventId1: timings[1].id,
              time1: timings[1].time,
            }, requestIds)
          );
        }
      };
    }

  };

  return Performance;

});
