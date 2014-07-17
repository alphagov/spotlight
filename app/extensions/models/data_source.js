define([
  'backbone',
  'Mustache',
  'lodash',
  'moment-timezone'
],
function (Backbone, Mustache, _, moment) {

  var backdropUrl;
  if (isServer) {
    backdropUrl = config.backdropUrl;
  } else if (isClient) {
    backdropUrl = GOVUK.config.backdropUrl;
  }

  var DataSource = Backbone.Model.extend({

    backdropUrl: backdropUrl,

    buildUrl: function (customQueryParams) {
      var url = Mustache.render(this.backdropUrl, this.attributes),
          rawQueryParams = _.merge(
            {},
            this.get('query-params') || {},
            customQueryParams
          );

      if (!_.isEmpty(rawQueryParams)) {
        url += '?' + this._objectToQueryString(
          this.configureTimespans(rawQueryParams));
      }

      return url;
    },

    setQueryParam: function (key, val) {
      var params = _.clone(this.get('query-params')) || {};
      var attrs = {};
      if (arguments.length === 2 && typeof key === 'string') {
        attrs[key] = val;
      } else {
        attrs = key;
      }
      _.extend(params, attrs);
      this.set('query-params', params);
    },

    groupedBy: function () {
      var queryParams = this.get('query-params');
      return (queryParams && queryParams['group_by']) || null;
    },

    configureTimespans: function (queryParams) {
      if (queryParams['start_at'] && !queryParams['end_at'] && !queryParams['duration']) {
        queryParams['end_at'] = moment();
      }
      if (queryParams.period && !queryParams.duration &&
            !(queryParams['start_at'] && queryParams['end_at'])) {
        queryParams.duration =
          DataSource.PERIOD_TO_DURATION[queryParams.period];
      }
      _.each(['start_at', 'end_at'], function (prop) {
        if (queryParams[prop]) {
          queryParams[prop] = moment(queryParams[prop]).utc().format(DataSource.ISO_8601);
        }
      });
      return queryParams;
    },

    _encodeValue: function (value) {
      var utcMoment;
      if (moment.isMoment(value)) {
        utcMoment = value.clone().utc();
        value = value.format(DataSource.ISO_8601);
      }
      return encodeURIComponent(value);
    },

    _objectToQueryString: function (obj) {
      return _.reduce(obj, function (parts, value, key) {
        var out;

        if (!(_.isNull(value) || _.isUndefined(value))) {
          if (_.isArray(value)) {
            out = _.map(value, function (sub_value) {
              return this._encodeValue(key) + '=' +
                this._encodeValue(sub_value);
            }, this).join('&');
          } else {
            out = this._encodeValue(key) + '=' + this._encodeValue(value);
          }

          parts.push(out);
        }

        return parts;
      }, [], this).join('&');
    }

  }, {

    ISO_8601: 'YYYY-MM-DD[T]HH:mm:ss[Z]',

    PERIOD_TO_DURATION: {
      hour: 24,
      day: 30,
      week: 9,
      month: 12,
      quarter: 24
    }

  });

  return DataSource;

});
