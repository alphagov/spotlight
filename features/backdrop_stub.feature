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
      | /backdrop-stub/licensing/api/realtime                                                                        | licensing_realtime.json                         |
      | /backdrop-stub/licensing/api/monitoring                                                                      | licensing_availability_response.json            |
      | /backdrop-stub/licensing/api/application?filter_by=licenceUrlSlug:application-to-licence-a-street-collection | application-to-licence-a-street-collection.json |
      | /backdrop-stub/licensing/api/application?filter_by=authorityUrlSlug:fake-authority-1?group_by=licenceUrlSlug | licensing_top_5_licenses.json                   |
      | /backdrop-stub/licensing/api/application?filter_by=authorityUrlSlug:fake-authority-1&period=week             | licensing_top.json                              |
      | /backdrop-stub/licensing/api/application?filter_by=authorityUrlSlug:fake-authority-1                         | fake-authority-1.json                           |
      | /backdrop-stub/licensing/api/application?group_by=authorityUrlSlug                                           | authorities.json                                |
      | /backdrop-stub/licensing/api/application?group_by=licenceUrlSlug                                             | licences.json                                   |
      | /backdrop-stub/licensing/api/applications                                                                    | licensing_applications.json                     |
      | /backdrop-stub/nonsense/api/some_rubbish?filter_by=dataType:licensing_overview_journey                       | licensing_overview_journey.json                 |
      | /backdrop-stub/pay-legalisation-post/api/journey                                                             | fco_overview_journey.json                       |
      | /backdrop-stub/pay-foreign-marriage-certificates/api/monitoring                                              | foreign_marriage_availability.json              |
      | /backdrop-stub/pay-register-death-abroad/api/journey                                                         | pay-register-death-abroad-journey.json          |
      | /backdrop-stub/deposit-foreign-marriage/api/journey                                                          | journey-with-missing-data.json                  |
      | /backdrop-stub/lasting-power-of-attorney/api/journey?group_by=eventLabel?filter_by=eventAction:help          | lpa_help_usage.json                             |
      | /backdrop-stub/lasting-power-of-attorney/api/journey                                                         | lpa_journey.json                                |
      | /backdrop-stub/lasting-power-of-attorney/api/monitoring                                                      | lpa_availability.json                           |
      | /backdrop-stub/lasting-power-of-attorney/api/blagh                                                           | lpa_volumes.json                                |
      | /backdrop-stub/vehicle-licensing/api/failures                                                                | vehicle_licensing_failures.json                 |
      | /backdrop-stub/vehicle-licensing/api/volumetrics?group_by=service                                            | vehicle_licensing_services.json                 |
      | /backdrop-stub/vehicle-licensing/api/volumetrics?group_by=channel                                            | vehicle_licensing_volumetrics.json              |
      | /backdrop-stub/vehicle-licensing/api/channels                                                                | vehicle_licensing_channels.json                 |
      | /backdrop-stub/vehicle-licensing/api/customer-satisfaction                                                   | vehicle_licensing_customer_satisfaction.json    |
      | /backdrop-stub/sorn/api/monitoring                                                                           | availability.json                               |
      | /backdrop-stub/sorn/api/realtime                                                                             | licensing_realtime.json                         |
      | /backdrop-stub/tax-disc/api/monitoring                                                                       | availability.json                               |
      | /backdrop-stub/tax-disc/api/realtime                                                                         | licensing_realtime.json                         |
      | /backdrop-stub/blagh/api/monitoring                                                                          | licensing_availability_response.json            |
