/*jshint quotmark: false */
define(['extensions/models/model', 'lodash', 'fs', 'path'], function (Model, _, fs, path) {

  var ResponseFetcher = Model.extend({

    stubMappings: [
      { 'key': {'service': 'transactions-explorer', 'api_name': 'spreadsheet'}, 'file': 'kpi.json'},
      { 'key': {'service': 'housing-policy', 'api_name': 'residential-transactions', 'collect': 'value:sum', 'period': 'month', 'group_by': 'geography'}, 'file':  'housing_residential_transactions.json'},
      { 'key': {'service': 'housing-policy', 'api_name': 'residential-transactions', 'collect': 'value:mean', 'period': 'quarter', 'group_by': 'geography'}, 'file':  'housing_residential_transactions_quarterly.json'},
      { 'key': {'service': 'housing-policy', 'api_name': 'house-price-index', 'collect': 'value:mean', 'period': 'quarter', 'group_by': 'geography'}, 'file':  'housing_house_price_index_quarterly.json'},
      { 'key': {'service': 'housing-policy', 'api_name': 'house-price-index', 'collect': 'value:sum', 'period': 'month', 'group_by': 'geography'}, 'file':  'housing_house_price_index.json'},
      { 'key': {'service': 'carers-allowance', 'api_name': 'journey'}, 'file':  'carers_allowance_journey.json'},
      { 'key': {'service': 'carers-allowance', 'api_name': 'journey', 'collect': 'uniqueEvents:sum', 'group_by': 'eventLabel', 'period': 'week'}, 'file':  'carers_allowance_completion_rate.json'},
      { 'key': {'service': 'licensing', 'api_name': 'monitoring'}, 'file':  'licensing_availability_response.json'},
      { 'key': {'service': 'licensing', 'api_name': 'application', 'filter_by': 'authorityUrlSlug:fake-authority-1', 'group_by': 'licenceUrlSlug'}, 'file':  'licensing_top_5_licenses.json'},
      { 'key': {'service': 'licensing', 'api_name': 'application', 'filter_by': 'authorityUrlSlug:fake-authority-1', 'period': 'week'}, 'file':  'licensing_top.json'},
      { 'key': {'service': 'licensing', 'api_name': 'application'}, 'file':  'licensing_applications.json'},
      { 'key': {'filter_by': 'dataType:licensing_overview_journey'}, 'file':  'licensing_overview_journey.json'},
      { 'key': {'service': 'pay-legalisation-post', 'api_name': 'journey', 'start_at': '2013-10-14T00:00:00+00:00'}, 'file':  'fco_overview_journey_start_14.json'},
      { 'key': {'service': 'pay-legalisation-post', 'api_name': 'journey', 'start_at': '2013-10-07T00:00:00+00:00'}, 'file':  'fco_overview_journey_start_7.json'},
      { 'key': {'service': 'pay-legalisation-post', 'api_name': 'journey'}, 'file':  'fco_overview_journey.json'},
      { 'key': {'service': 'pay-foreign-marriage-certificates', 'api_name': 'monitoring'}, 'file':  'foreign_marriage_availability.json'},
      { 'key': {'service': 'pay-foreign-marriage-certificates', 'api_name': 'journey', 'collect': 'uniqueEvents:sum', 'group_by': 'eventCategory', 'period': 'week'}, 'file':  'pay_foreign_marriage_certificates_journey.json'},
      { 'key': {'service': 'pay-register-death-abroad', 'api_name': 'journey'}, 'file':  'pay-register-death-abroad-journey.json'},
      { 'key': {'service': 'deposit-foreign-marriage', 'api_name': 'journey'}, 'file':  'journey-with-missing-data.json'},
      { 'key': {'service': 'deposit-foreign-marriage', 'api_name': 'monitoring', 'period': 'hour'}, 'file':  'deposit_foreign_marriage_monitoring_hour.json'},
      { 'key': {'service': 'deposit-foreign-marriage', 'api_name': 'monitoring', 'period': 'day'}, 'file':  'deposit_foreign_marriage_monitoring_day.json'},
      { 'key': {'service': 'lasting-power-of-attorney', 'api_name': 'journey', 'group_by': 'eventLabel', 'filter_by': 'eventAction:help'}, 'file':  'lpa_help_usage.json'},
      { 'key': {'service': 'lasting-power-of-attorney', 'api_name': 'journey'}, 'file':  'lpa_journey.json'},
      { 'key': {'service': 'lasting-power-of-attorney', 'api_name': 'monitoring'}, 'file':  'lpa_availability.json'},
      { 'key': {'service': 'lasting-power-of-attorney'}, 'file':  'lpa_volumes.json'},
      { 'key': {'service': 'vehicle-licensing', 'api_name': 'failures'}, 'file':  'vehicle_licensing_failures.json'},
      { 'key': {'service': 'vehicle-licensing', 'api_name': 'volumetrics', 'group_by': 'service'}, 'file':  'vehicle_licensing_services.json'},
      { 'key': {'service': 'vehicle-licensing', 'api_name': 'volumetrics', 'group_by': 'channel'}, 'file':  'vehicle_licensing_volumetrics.json'},
      { 'key': {'service': 'vehicle-licensing', 'api_name': 'channels'}, 'file':  'vehicle_licensing_channels.json'},
      { 'key': {'service': 'vehicle-licensing', 'api_name': 'customer-satisfaction'}, 'file':  'vehicle_licensing_customer_satisfaction.json'},
      { 'key': {'service': 'sorn', 'api_name': 'monitoring'}, 'file':  'availability.json'},
      { 'key': {'service': 'tax-disc', 'api_name': 'monitoring'}, 'file':  'availability.json'},
      { 'key': {'service': 'housing-policy', 'api_name': 'dwellings', 'group_by': 'type'}, 'file':  'dwellings-starts-completes.json'},
      { 'key': {'api_name': 'monitoring', 'period': 'hour'}, 'file':  'deposit_foreign_marriage_monitoring_hour.json'},
      { 'key': {'api_name': 'monitoring', 'period': 'day'}, 'file':  'deposit_foreign_marriage_monitoring_day.json'},
      { 'key': {'api_name': 'realtime'}, 'file':  'licensing_realtime.json'},
      { 'key': {'service': 'govuk', 'api_name': 'most_viewed', 'sort_by': 'pageviews:descending', 'limit': '10'}, 'file': 'govuk_most_viewed.json'},
      { 'key': {'service': 'govuk', 'api_name': 'most_viewed_policies', 'sort_by': 'pageviews:descending', 'limit': '10'}, 'file': 'govuk_most_viewed_policies.json'},
      { 'key': {'service': 'govuk', 'api_name': 'most_viewed_news', 'sort_by': 'pageviews:descending', 'limit': '10'}, 'file': 'govuk_most_viewed_news.json'},
      { 'key': {'service': 'govuk', 'api_name': 'trending', 'sort_by': 'percent_change:descending', 'limit': '10'}, 'file': 'govuk_trending.json'},
      { 'key': {'service': 'housing-policy', 'api_name': 'first-time-buyer'}, 'file': 'housing-first-time-buyer.json'},
      { 'key': {'service': 'carers-allowance', 'api_name': 'weekly-claims', 'collect': 'value:sum', 'period': 'week', 'group_by': 'key', 'start_at': '2013-10-14T00:00:00+00:00'}, 'file': 'carers_allowance_weekly_by_channel_start_14.json'},
      { 'key': {'service': 'carers-allowance', 'api_name': 'weekly-claims', 'collect': 'value:sum', 'period': 'week', 'group_by': 'key', 'start_at': '2013-10-07T00:00:00+00:00'}, 'file': 'carers_allowance_weekly_by_channel_start_7.json'},
      { 'key': {'service': 'carers-allowance', 'api_name': 'weekly-claims', 'collect': 'value:sum', 'period': 'week', 'group_by': 'key'}, 'file': 'carers_allowance_weekly_by_channel_start_7.json'},
      { 'key': {'service': 'carers-allowance', 'api_name': 'weekly-claims'}, 'file': 'carers-allowance-weekly-claims.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'period': 'month', 'collect': 'monthly_spend:sum', 'group_by': 'sme_large' }, 'file': 'g-cloud-proportion-smes-spend.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'period': 'month', 'collect': 'count:sum', 'group_by': 'sme_large' }, 'file': 'g-cloud-proportion-smes-count.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'period': 'month', 'collect': 'cumulative_spend:sum', 'group_by': 'sector'}, 'file': 'g-cloud-who-is-using.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'collect': 'cumulative_spend:sum', 'period': 'month', 'group_by': 'sme_large'}, 'file': 'g-cloud-procurement.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'collect': 'cumulative_count:sum', 'period': 'month', 'group_by': 'sme_large'}, 'file': 'g-cloud-procurement-count.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'collect': 'monthly_spend:sum', 'period': 'month', 'group_by': 'sme_large'}, 'file': 'g-cloud-monthly-procurement.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'collect': 'count:sum', 'period': 'month', 'group_by': 'sme_large'}, 'file': 'g-cloud-monthly-procurement-count.json'},
      { 'key': {'service': 'gcloud', 'api_name': 'sales', 'period': 'month', 'collect': 'monthly_spend:sum', 'group_by': 'lot'}, 'file': 'g-cloud-monthly-by-lot.json'}
    ],

    fetchJson: function (request) {
      var mapping = _.find(this.stubMappings, function (mapping) {
        var requestParams = this.getRequestParams(request, Object.keys(mapping.key));
        var originalRequestParams = _.clone(requestParams);
        var requestParamsMatchingKey = _.extend(requestParams, mapping.key);
        return JSON.stringify(originalRequestParams) === JSON.stringify(requestParamsMatchingKey);
      }, this);
      if (mapping) {
        return this.getFileContents(mapping.file);
      } else {
        return null;
      }
    },

    getRequestParams: function (request, requiredParams) {
      return _.reduce(requiredParams, function (requestParams, key) {
        requestParams[key] = request.param(key);
        return requestParams;
      }, {});
    },

    getFileContents: function (fileName) {
      return JSON.parse(fs.readFileSync(path.join('app/support/backdrop_stub/responses', fileName)));
    }

  });

  return ResponseFetcher;

});
