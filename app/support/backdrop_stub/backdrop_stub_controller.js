define(['vendor/lodash'], function (_) {
  
  var stub_mappings = [
    { 'key': {'service': 'licensing', 'api_name': 'realtime'}, 'file':  'licensing_realtime.json'},
    { 'key': {'service': 'licensing', 'api_name': 'monitoring'}, 'file':  'licensing_availability_response.json'},
    { 'key': {'service': 'licensing', 'api_name': 'application', 'filter_by': 'licenceUrlSlug:application-to-licence-a-street-collection'}, 'file':  'application-to-licence-a-street-collection.json'},
    { 'key': {'service': 'licensing', 'api_name': 'application', 'filter_by': 'authorityUrlSlug:fake-authority-1', 'group_by': 'licenceUrlSlug'}, 'file':  'licensing_top_5_licenses.json'},
    { 'key': {'service': 'licensing', 'api_name': 'application', 'filter_by': 'authorityUrlSlug:fake-authority-1', 'period': 'week'}, 'file':  'licensing_top.json'},
    { 'key': {'service': 'licensing', 'api_name': 'application', 'filter_by': 'authorityUrlSlug:fake-authority-1'}, 'file':  'fake-authority-1.json'},
    { 'key': {'service': 'licensing', 'api_name': 'application', 'group_by': 'authorityUrlSlug'}, 'file':  'authorities.json'},
    { 'key': {'service': 'licensing', 'api_name': 'application', 'group_by': 'licenceUrlSlug'}, 'file':  'licences.json'},
    { 'key': {'service': 'licensing', 'api_name': 'applications'}, 'file':  'licensing_applications.json'},
    { 'key': {'filter_by': 'dataType:licensing_overview_journey'}, 'file':  'licensing_overview_journey.json'},
    { 'key': {'service': 'pay-legalisation-post', 'api_name': 'journey'}, 'file':  'fco_overview_journey.json'},
    { 'key': {'service': 'pay-foreign-marriage-certificates', 'api_name': 'monitoring'}, 'file':  'foreign_marriage_availability.json'},
    { 'key': {'service': 'pay-register-death-abroad', 'api_name': 'journey'}, 'file':  'pay-register-death-abroad-journey.json'},
    { 'key': {'service': 'deposit-foreign-marriage', 'api_name': 'journey'}, 'file':  'journey-with-missing-data.json'},
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
    { 'key': {'service': 'sorn', 'api_name': 'realtime'}, 'file':  'licensing_realtime.json'},
    { 'key': {'service': 'tax-disc', 'api_name': 'monitoring'}, 'file':  'availability.json'},
    { 'key': {'service': 'tax-disc', 'api_name': 'realtime'}, 'file':  'licensing_realtime.json'},
    { 'key': {'api_name': 'monitoring'}, 'file':  'licensing_availability_response.json'}
  ];

  var fetch_json = function (request) {
    _.each(stub_mappings, function(mapping) {
      var request_params = get_request_params(request, Object.keys(mapping.key));
      if (merge(request_params, mapping.key) == request_params) {
        return get_file_contents(mapping.file);
      }
    });
  };

  var get_request_params = function (request, required_params) {
    return _.reduce(required_params, function(request_params, key){ request_params[key] = request.param(key) }, {})
  };

  var get_file_contents = function (file_name) {
    console.log(file_name);
  };

  var merge = function (obj1,obj2) {
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
  };

  return function (req, res) {
    console.log(req);
    console.log(stub_mappings);
    fetch_json(req);
    res.json({status: 'ok'});
  };
});
