define([
  'common/views/visualisations/visitors-realtime',
  'common/views/visualisations/multi_stat_item/sparkline'
],
function (View, SparklineView) {
  var VisitorsRealtimeView = View.extend({

    valueTag: '.impact-number strong',
    labelTag: '.stat-description',
    graphLabelTag: '.sparkline-title',

    initialize: function (options) {
      options = options || {};

      View.prototype.initialize.apply(this, arguments);

      this.listenTo(this.collection, 'change:selected', this.onChangeSelected, this);
      this.listenTo(this.collection, 'sync', function () { this.onChangeSelected(); }, this);

      this.currentVisitors = this.getCurrentVisitors();

    },

    onChangeSelected: function (selectGroup, selectGroupIndex, selectModel) {
      var content = this.noDataMessage,
          selection = this.collection.getCurrentSelection(),
          label;

      this.currentVisitors = this.getCurrentVisitors();

      if (selectModel) {
        this.selectedModel = _.isArray(selectModel) ? selectModel[0] : selectModel;
      }

      if (this.selectedModel) {
        selection.selectedModel = this.selectedModel;
      }

      if (selection.selectedModel) {
        content = this.getValueSelected(selection);
        label = this.getLabelSelected(selection);
      } else {
        content = this.getValue();
        label = this.getLabel();
      }

      this.$el.find(this.valueTag).html(content);
      this.$el.find(this.labelTag).html(label.headline);
      this.$el.find(this.graphLabelTag).html(label.graph);
      delete this.selectedModel;
    },

    views: function () {
      var views = {};
      if (this.collection && this.collection.length && this.collection.first().get('values').length > 1) {
        views['.sparkline-graph'] = {
          view: SparklineView,
          options: function () {
            return {
              valueAttr: this.valueAttr,
              period: 'hour',
              showStartAndEndTicks: true
            };
          }
        };
      }
      return views;
    },

    getValue: function () {
      return this.getCurrentVisitors();
    },

    getValueSelected: function (selection) {
      if (selection.selectedModel) {
        var val = selection.selectedModel.get(this.valueAttr);
        val = Math.round(val);
        this.currentVisitors = val;
        return val;
      } else {
        return null;
      }
    },

    getLabel: function () {

      var latestDate, startDate, timePeriod, timePeriodValue, headlineLabel, graphLabel;

      if (this.collection.first().get('values').length > 1) {

        latestDate = this.collection.first().get('values').last().get('_timestamp');
        startDate = this.collection.first().get('values').first().get('_timestamp');

        if (latestDate) {
          var period = 'hour';
          if (latestDate.diff(startDate, 'hours') < 1) {
            period = 'minute';
          }
          timePeriod = latestDate.diff(startDate, period);
          timePeriodValue = this.format(timePeriod, { type: 'plural', singular: period });
          var users = this.format(this.currentVisitors, { type: 'plural', singular: 'user' });
          if (this.moment().diff(latestDate, 'minutes') > 10) {
            var formattedDate = this.format(latestDate, { type: 'date', format: 'ha D MMMM YYYY' });
            headlineLabel = [users, 'online at<br/>', formattedDate].join(' ');
            graphLabel = [users, 'in the', timePeriod, timePeriodValue, 'to<br/>', formattedDate].join(' ');
          } else {
            headlineLabel = [users, 'online now'].join(' ');
            graphLabel = [users.charAt(0).toUpperCase() + users.slice(1),
                     'over past', timePeriod, timePeriodValue].join(' ');
          }
        }
      }

      if (!latestDate) {
        headlineLabel = this.noDataMessage;
        graphLabel = this.noDataMessage;
      }

      return {
        'headline': headlineLabel,
        'graph': graphLabel
      };
    },

    getLabelSelected: function (selection) {

      var headline;

      if (selection.selectedModel) {
        var timestamp = selection.selectedModel.get('_timestamp'),
            users = this.format(this.currentVisitors, { type: 'plural', singular: 'user' });

        headline = [
          users,
          ' ',
          this.moment(timestamp).calendar(),
          ',<br />',
          this.moment(timestamp).fromNow()
        ].join('');
      } else {
        headline = this.noDataMessage;
      }

      return {
        'headline': headline,
        'graph': ''
      };
    }

  });
  return VisitorsRealtimeView;
});