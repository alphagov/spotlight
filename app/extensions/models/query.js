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
      var key;
      if (!_.isObject(attrs)) {
        key = attrs;
        (attrs = {})[key] = options;
        options = arguments[2];
      }
      options = options || {};
      var period = attrs.period ? this.periods[attrs.period] : null;
      if (period) {
        var endAt = period.boundary(this.getMoment());
        endAt.subtract(getAndDelete(attrs, 'ago', 0), period.unit);
        var duration = getAndDelete(attrs, 'duration', null) || period.duration;
        var startAt = endAt.clone().subtract(
          duration, period.unit
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
        unit: 'hours',
        boundary: function (date) {
          return date.startOf('hour');
        },
        duration: 24
      },
      day: {
        unit: 'days',
        boundary: function (date) {
          return date.startOf('day');
        },
        duration: 30
      },
      week: {
        unit: 'weeks',
        boundary: function (date) {
          return date.day(1).startOf('day');
        },
        duration: 9
      },
      month: {
        unit: 'months',
        boundary: function (date) {
          return date.startOf('month');
        },
        duration: 12
      },
      quarter: {
        unit: 'months',
        boundary: function (date) {
          var quarterAdjustment = (date.month() % 4) + 1;
          return date.subtract({months: quarterAdjustment}).startOf('month');
        },
        duration: 24 * 4
      }
    }
  });

  return Query;
});
