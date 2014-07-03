define([
  './grouped_timeseries',
  'moment-timezone'
],
function (GroupedCollection, moment) {

  var format = 'YYYY-MM-DD[T]HH:mm:ss';

  return GroupedCollection.extend({
    queryParams: function () {
      var params = GroupedCollection.prototype.queryParams.apply(this, arguments);
      params.duration = this.duration();
      if (this.options.startAt) {
        params.start_at = moment(this.options.startAt).subtract(this.options.period, this.timeshift()).format(format);
        params.duration = this.standardDuration();
      }
      return params;
    },

    standardDuration: function () {
      if (this.options.duration) {
        return this.options.duration;
      } else {
        return this.query.periods[this.options.period].duration;
      }
    },

    duration: function () {
      return this.timeshift() + this.standardDuration();
    },

    timeshift: function () {
      var seriesList = this.options.axes && this.options.axes.y,
          maxTimeshift = _.max(seriesList, function (series) {
            return series.timeshift;
          });
      return (maxTimeshift.timeshift || 0);
    },

    flatten: function (data) {
      data = GroupedCollection.prototype.flatten.apply(this, arguments);
      return _.filter(data, function (model) {
        return moment(_.last(data)._start_at).diff(model._start_at, this.options.period) < this.options.duration;
      }, this);
    },

    mergeDataset: function (source, target, axis) {
      if (axis.timeshift) {
        _.each(source.values, function (model, i) {
          model._original_start_at = model._start_at;
          model._original_end_at = model._end_at;
          var _start_at = moment(model._start_at);
          var _end_at = moment(model._start_at);
          _start_at.add(this.options.period, axis.timeshift).format(format);
          _end_at.add(this.options.period, axis.timeshift).format(format);

          if (target.values[i + axis.timeshift]) {
            target.values[i + axis.timeshift]['timeshift' + axis.timeshift + ':' + axis.groupId + ':' + this.valueAttr] = model[this.valueAttr];
          }
        }, this);
      } else {
        GroupedCollection.prototype.mergeDataset.apply(this, arguments);
      }
    }

  });
});
