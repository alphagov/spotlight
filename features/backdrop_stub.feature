Feature: Backdrop stubs
  In order to be sure the backdrop stubs are available
  As a developer
  I want to do a check on the expected routes to the backdrop stubs

  @wip
  Scenario Outline: navigating to service
    When I go to <Location>
    And I should receive the appropriate "<Json File>"
    
    Examples:
      | Location                                                                                                   | Json File                                       |
      | /performance/licensing/api/realtime                                                                        | licensing_realtime.json                         |
      #| /performance/licensing/api/monitoring                                                                      | licensing_availability_response.json            |
      #| /performance/licensing/api/application?filter_by=licenceUrlSlug:application-to-licence-a-street-collection | application-to-licence-a-street-collection.json |
      #| /performance/licensing/api/application?filter_by=authorityUrlSlug:fake-authority-1?group_by=licenceUrlSlug | licensing_top_5_licenses.json                   |
      #| /performance/licensing/api/application?filter_by=authorityUrlSlug:fake-authority-1&period=week             | licensing_top.json                              |
      #| /performance/licensing/api/application?filter_by=authorityUrlSlug:fake-authority-1                         | fake-authority-1.json                           |
      #| /performance/licensing/api/application?group_by=authorityUrlSlug                                           | authorities.json                                |
      #| /performance/licensing/api/application?group_by=licenceUrlSlug                                             | licences.json                                   |
      #| /performance/licensing/api/applications                                                                    | licensing_applications.json                     |
      #| /performance/nonsense/api/some_rubbish?filter_by=dataType:licensing_overview_journey                       | licensing_overview_journey.json                 |
      #| /performance/pay-legalisation-post/api/journey                                                             | fco_overview_journey.json                       |
      #| /performance/pay-foreign-marriage-certificates/api/monitoring                                              | foreign_marriage_availability.json              |
      #| /performance/pay-register-death-abroad/api/journey                                                         | pay-register-death-abroad-journey.json          |
      #| /performance/deposit-foreign-marriage/api/journey                                                          | journey-with-missing-data.json                  |
      #| /performance/lasting-power-of-attorney/api/journey?group_by=eventLabel?filter_by=eventAction:help          | lpa_help_usage.json                             |
      #| /performance/lasting-power-of-attorney/api/journey                                                         | lpa_journey.json                                |
      #| /performance/lasting-power-of-attorney/api/monitoring                                                      | lpa_availability.json                           |
      #| /performance/lasting-power-of-attorney/api/blagh                                                           | lpa_volumes.json                                |
      #| /performance/vehicle-licensing/api/failures                                                                | vehicle_licensing_failures.json                 |
      #| /performance/vehicle-licensing/api/volumetrics?group_by=service                                            | vehicle_licensing_services.json                 |
      #| /performance/vehicle-licensing/api/volumetrics?group_by=channel                                            | vehicle_licensing_volumetrics.json              |
      #| /performance/vehicle-licensing/api/channels                                                                | vehicle_licensing_channels.json                 |
      #| /performance/vehicle-licensing/api/customer-satisfaction                                                   | vehicle_licensing_customer_satisfaction.json    |
      #| /performance/sorn/api/monitoring                                                                           | availability.json                               |
      #| /performance/sorn/api/realtime                                                                             | licensing_realtime.json                         |
      #| /performance/tax-disc/api/monitoring                                                                       | availability.json                               |
      #| /performance/tax-disc/api/realtime                                                                         | licensing_realtime.json                         |
      #| /performance/blagh/api/monitoring                                                                          | licensing_availability_response.json            |
