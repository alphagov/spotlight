define([
  'backbone',
  'Mustache',
  'lodash'
],
function (Backbone, Mustache, _) {

  var backdropUrl;
  if (isServer) {
    backdropUrl = config.backdropUrl;
  } else if (isClient) {
    backdropUrl = GOVUK.config.backdropUrl;
  }

  var DataSource = Backbone.Model.extend({

    buildUrl: function (customQueryParams) {
      var url = Mustache.render(backdropUrl, this.attributes),
          rawQueryParams = _.merge(this.get('query-params') || {}, customQueryParams),
          queryParams;

      if (!_.isEmpty(rawQueryParams)) {
          console.log(rawQueryParams);
          queryParams = this._normaliseQueryKeys(
                          this._applyDefaultDuration(rawQueryParams)),
          url += '?' + this._objectToQueryString(queryParams);
      }

      console.log('built url:', url);

      return url;
    },

    _applyDefaultDuration: function(queryParams) {
                             console.log(queryParams);
      if (queryParams.period && !queryParams.duration) {
        queryParams.duration =
          DataSource.PERIOD_TO_DURATION[queryParams.period];
      }
      return queryParams;
    },

    _normaliseQueryKeys: function(queryParams) {
      return _.reduce(queryParams, function(out, value, key) {
        out[key.replace('-', '_')] = value;
        return out;
      }, {});
    },

    _objectToQueryString: function(obj) {
      return _.reduce(obj, function(parts, value, key) {
        var out;

        if (_.isArray(value)) {
          out = _.map(value, function(sub_value) {
            return encodeURIComponent(key) + '=' +
              encodeURIComponent(sub_value);
          }).join('&');
        } else {
          out = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }

        parts.push(out);

        return parts
      }, []).join('&');
    }

  }, {

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
