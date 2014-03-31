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

      // Use existing attributes where available. But if the
      // period has changed, reset the start date attribute.
      // This is important for the tabbed availability module.
      var existingAttrs = _.clone(this.attributes);
      if (attrs.period && existingAttrs.period && (existingAttrs.period !== attrs.period)) {
        attrs.start_at = null;
      }
      attrs = _.extend(existingAttrs, attrs);

      if (period) {
        var duration = getAndDelete(attrs, 'duration', null);
        var ago = getAndDelete(attrs, 'ago', 0);
        attrs.start_at = attrs.start_at ? this.moment(attrs.start_at) : null;
        attrs.end_at = attrs.end_at ? this.moment(attrs.end_at) : null;

        if (_.isNull(attrs.end_at)) {
          var endAt = period.boundary(this.getMoment());
          endAt.subtract(ago, period.unit);
          attrs.end_at = endAt;
        }
        if (_.isNull(attrs.start_at)) {
          duration = duration || period.duration;
          var startAt = attrs.end_at.clone().subtract(
            duration, period.unit
          );
          attrs.start_at = startAt;
        }
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
