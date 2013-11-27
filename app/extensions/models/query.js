define([
  'extensions/models/model'
],
function (Model) {
  function getAndDelete(obj, property, defaultValue) {
    var value = defaultValue;

    if (!_.isUndefined(obj[property])) {
      value = obj[property];
      delete obj[property];
    }

    return value;
  }

  var Query = Model.extend({

    set: function (attrs, options) {
      if (!_.isObject(attrs)) {
        key = attrs;
        (attrs = {})[key] = options;
        options = arguments[2];
      }
      options = options || {};
      var periodName = attrs.period;
      var period = periodName ? this.periods[periodName] : null;
      if (period) {
        var endAt = period.boundary(this.getMoment());
        endAt.subtract(getAndDelete(attrs, 'ago', 0), periodName + 's');
        var duration = getAndDelete(attrs, 'duration', null) || period.duration;
        var startAt = endAt.clone().subtract(
          duration, periodName + 's'
        );
        _.extend(attrs, {
          end_at: endAt,
          start_at: startAt
        });
      }

      Model.prototype.set.call(this, attrs, options);
    },

    periods: {
      hour: {
        boundary: function (date) {
          return date.startOf('hour');
        },
        duration: 24
      },
      day: {
        boundary: function (date) {
          return date.startOf('day');
        },
        duration: 30
      },
      week: {
        boundary: function (date) {
          return date.day(1).startOf('day');
        },
        duration: 9
      },
      month: {
        boundary: function (date) {
          return date.startOf('month');
        },
        duration: 12
      }
    }
  });

  return Query;
});