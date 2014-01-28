define([
  'extensions/views/view',
  'common/views/visualisations/multi_stat_item/sparkline',
  'tpl!common/templates/visualisations/visitors-realtime.html'
],
function (View, SparklineView, template) {
  var VisitorsRealtimeView = View.extend({

    template: template,
    changeOnSelected: true,
    sparkline: true,

    valueTag: '.impact-number strong',
    labelTag: '.stat-description',
    graphLabelTag: '.sparkline-title',

    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);

      this.selectionValueAttr = 'unique_visitors';

      var events = '';
      if (this.changeOnSelected) {
        events += ' change:selected';
      }
      this.collection.on(events, this.render, this);

      this.currentVisitors = this.getCurrentVisitors();

    },

    render: function() {
      View.prototype.render.apply(this, arguments);

      var value, headlineLabel, labels, graphLabel, content;
      var selection = this.collection.getCurrentSelection();

      if (selection.selectedModel) {
        value = this.getValueSelected(selection);
        labels = this.getLabelSelected(selection);
        headlineLabel = labels.headline;
        graphLabel = labels.graph;
      } else {
        value = this.getValue();
        labels = this.getLabel();
        headlineLabel = labels.headline;
        graphLabel = labels.graph;
      }

      if (value === null) {
        content = "<span class='no-data'>(no data)</span>";
      } else {
        content = value;
      }

      this.$el.find(this.valueTag).html(content);
      this.$el.find(this.labelTag).html(headlineLabel);
      this.$el.find(this.graphLabelTag).html(graphLabel);

    },

    getCurrentVisitors: function () {
      if (this.collection && this.collection.length && this.collection.first().get('values').length) {
        var val = parseFloat(this.collection.first().get('values').last().get(this.selectionValueAttr));
        val = Math.round(val);
        this.currentVisitors = val;
        return this.formatNumericLabel(val);
      } else {
        return null;
      }
    },

    templateContext: function () {
      var numberOfVisitors = null;
      if (this.currentVisitors != null) {
        numberOfVisitors = Math.round(this.currentVisitors);
      }

      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        { numberOfVisitors: numberOfVisitors }
      );
    },

    views: function() {
     var views = {};
     // Only render sparkline if more than one data item exists.
     if (this.collection && this.collection.length && this.collection.first().get('values').length > 1 && this.sparkline) {
       views['.sparkline-graph'] = {
          view: SparklineView,
          options: function () {
            return {
              valueAttr: this.selectionValueAttr,
              period: "hour"
            };
          }
        };
     }
     return views;
    },

    formatDate: function (d) {
      return [
        d.format('ha'),
        " ",
        d.format('D MMMM YYYY')
      ].join('');
    },

    getValue: function () {
      return this.getCurrentVisitors();
    },

    getLabel: function () {

      var latestDate, startDate, timePeriod, timePeriodValue, headlineLabel, graphLabel;

      if (this.collection.first().get('values').length > 1) {

        latestDate = this.collection.first().get('values').last().get('_timestamp');
        startDate = this.collection.first().get('values').first().get('_timestamp');

        if (latestDate) {
          var period = "hour";
          if (startDate.diff(latestDate, 'hours') < 1) {
            period = "minute";
          }
          timePeriod = latestDate.diff(startDate, period);
          timePeriodValue = this.pluralise(period, timePeriod);
          var users = this.pluralise("user", this.currentVisitors);
          if (this.moment().diff(latestDate, 'minutes') > 10) {
            var formattedDate = this.formatDate(latestDate);
            headlineLabel = [users, "online at<br/>", formattedDate].join(' ');
            graphLabel = [users, "in the", timePeriod, timePeriodValue, "to<br/>", formattedDate].join(' ');
          } else {
            headlineLabel = [users, "online now"].join(' ');
            graphLabel = [users.charAt(0).toUpperCase() + users.slice(1),
                     "over past", timePeriod, timePeriodValue].join(' ');
          }
        }
      }

      if (!latestDate) {
        headlineLabel = "<span class='no-data'>(no data)</span>";
        graphLabel = "<span class='no-data'>(no data)</span>";
      }

      return {
        'headline': headlineLabel,
        'graph': graphLabel
      };
    },

    getValueSelected: function (selection) {
      if (selection.selectedModel) {
        var val = selection.selectedModel.get(this.selectionValueAttr);
        val = Math.round(val);
        this.currentVisitors = val;
        return this.formatNumericLabel(val);
      } else {
        return null;
      }
    },

    getLabelSelected: function (selection) {

      var selectedTime, selectedTimeDiff, headline;

      if (selection.selectedModel) {
        var timestamp = selection.selectedModel.get('_timestamp');

        selectedTime = this.moment(timestamp).calendar();
        selectedTime = selectedTime.charAt(0).toLowerCase() + selectedTime.slice(1);
        selectedTimeDiff = this.moment(timestamp).fromNow();

        var users = this.pluralise("user", this.currentVisitors);
        headline = [users, " ", selectedTime, ", ", selectedTimeDiff].join('');
      } else {
        selectedTimeDiff = "<span class='no-data'>(no data)</span>";
        headline = "<span class='no-data'>(no data)</span>";
      }

      return {
        'headline': headline,
        'graph': selectedTimeDiff
      };
    }

  });
  return VisitorsRealtimeView;
});
