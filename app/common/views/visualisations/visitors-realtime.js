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

    valueAttr: 'unique_visitors',

    initialize: function (options) {
      options = options || {};

      View.prototype.initialize.apply(this, arguments);

      this.changeOnSelected = options.changeOnSelected || this.changeOnSelected;

      if (this.changeOnSelected) {
        this.listenTo(this.collection, 'change:selected', this.onChangeSelected, this);
      }

      if (isClient) {
        this.listenTo(this.collection, 'sync', this.render, this);
      }

      this.currentVisitors = this.getCurrentVisitors();

    },

    onChangeSelected: function (selectGroup, selectGroupIndex, selectModel) {
      var content = '<span class="no-data">(no data)</span>',
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

    render: function () {

      View.prototype.render.apply(this, arguments);

      this.onChangeSelected();
    },

    getCurrentVisitors: function () {
      if (this.collection && this.collection.length && this.collection.first().get('values').length) {
        var val = this.collection.first().get('values').last().get(this.valueAttr);
        val = Math.round(val);
        this.currentVisitors = val;
        return val;
      } else {
        return null;
      }
    },

    templateContext: function () {
      var numberOfVisitors = null;
      if (this.currentVisitors) {
        numberOfVisitors = Math.round(this.currentVisitors);
      }

      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        { numberOfVisitors: numberOfVisitors }
      );
    },

    views: function () {
      var views = {};
      if (this.collection && this.collection.length && this.collection.first().get('values').length > 1 && this.sparkline) {
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

    formatDate: function (d) {
      return [
        d.format('ha'),
        ' ',
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
          var period = 'hour';
          if (latestDate.diff(startDate, 'hours') < 1) {
            period = 'minute';
          }
          timePeriod = latestDate.diff(startDate, period);
          timePeriodValue = this.pluralise(period, timePeriod);
          var users = this.pluralise('user', this.currentVisitors);
          if (this.moment().diff(latestDate, 'minutes') > 10) {
            var formattedDate = this.formatDate(latestDate);
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
        headlineLabel = '<span class="no-data">(no data)</span>';
        graphLabel = '<span class="no-data">(no data)</span>';
      }

      return {
        'headline': headlineLabel,
        'graph': graphLabel
      };
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

    getLabelSelected: function (selection) {

      var headline;

      if (selection.selectedModel) {
        var timestamp = selection.selectedModel.get('_timestamp'),
            users = this.pluralise('user', this.currentVisitors);

        headline = [
          users,
          ' ',
          this.moment(timestamp).calendar(),
          ',<br />',
          this.moment(timestamp).fromNow()
        ].join('');
      } else {
        headline = '<span class="no-data">(no data)</span>';
      }

      return {
        'headline': headline,
        'graph': ''
      };
    }

  });
  return VisitorsRealtimeView;
});
