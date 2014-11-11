define([
  './grouped_timeseries',
  'extensions/models/data_source',
  'moment-timezone'
],
function (GroupedCollection, DataSource, moment) {

  var format = 'YYYY-MM-DD[T]HH:mm:ss';

  return GroupedCollection.extend({
    queryParams: function () {
      var params = {};
      var options = this.dataSource.get('query-params');
      params.duration = this.duration();
      if (options.startAt) {
        params.start_at = moment(options.startAt).subtract(this.timeshift(), this.getPeriod()).format(format);
        params.duration = this.standardDuration();
      }
      return params;
    },

    standardDuration: function () {
      var options = this.dataSource.get('query-params');
      if (options.duration) {
        return options.duration;
      } else {
        return DataSource.PERIOD_TO_DURATION[this.getPeriod()];
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
        return moment(_.last(data)._start_at).diff(model._start_at, this.getPeriod()) < this.standardDuration();
      }, this);
    },

    mergeDataset: function (source, target, axis) {
      if (axis.timeshift) {
        _.each(source.values, function (model, i) {
          model._original_start_at = model._start_at;
          model._original_end_at = model._end_at;
          var _start_at = moment(model._start_at);
          var _end_at = moment(model._start_at);
          _start_at.add(axis.timeshift, this.getPeriod()).format(format);
          _end_at.add(axis.timeshift, this.getPeriod()).format(format);

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
