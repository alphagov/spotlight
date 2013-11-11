define([
  './axis'
],
function (Axis) {
  
  var XAxis = Axis.extend({
    
    classed: 'x-axis',
    position: 'bottom',
    orient: 'bottom',
    offsetY: 8,
    tickPadding: 6,
    getScale: function () {
      return this.scales.x;
    },
    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      var ticks = this.componentWrapper.selectAll('.tick');
      ticks.classed('selected', false);

      if (indexSelected != null) {
        d3.select(ticks[0][indexSelected]).classed('selected', true);
      }
    },

    configs: {
      hour: {
        getTick: function (model) {
          return model.get('_end_at').toDate();
        },
        tickFormat: function () {
          var moment = this.moment;
          return function (d, index) {
            var date = moment(d);
            if (date.hours() === 0) {
              return 'midnight';
            } else if (date.hours() === 12) {
              return 'midday';
            } else {
              return moment(d).format('ha');
            }
          };
        },
        tickValues: function () {
          var values = this.collection.first().get('values').filter(function (model, index) {
            return model.get('_end_at').hours() % 6 === 0;
          });
          return _.map(values, this.getTick);
        }
      },
      day: {
        getTick: function (model) {
          return moment(model.get('_end_at')).subtract(1, 'days').toDate();
        },
        tickFormat: function () {
          var moment = this.moment;
          return function (d, index) {
            var date = moment(d);
            if (date.days() === 1) {
              return date.format('D MMM');
            } else {
              return '';
            }
          };
        },
        tickValues: function () {
          return this.collection.first().get('values').map(this.getTick);
        }
      },
      week: {
        getTick: function (model) {
          return moment(model.get('_end_at')).subtract(1, 'days').toDate();
        },
        tickFormat: function () {
          var moment = this.moment;
          return function (d, index) {
            return moment(d).format('D MMM');
          };
        },
        tickValues: function () {
          return this.collection.first().get('values').map(this.getTick);
        }
      },
      month: {
        getTick: function (model, index) {
          return index;
        },
        tickFormat: function () {
          var period = this.collection.query.get('period');
          var values = this.collection.first().get('values');
          return function (d, index) {
            return values.at(index).get('_start_at').format('MMM');
          };
        },
        tickValues: function () {
          return this.collection.first().get('values').map(this.getTick);
        }
      }
    }
  });
  
  return XAxis;
});
