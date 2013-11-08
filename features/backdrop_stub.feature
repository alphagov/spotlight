Feature: Backdrop stubs
  In order to be sure the backdrop stubs are available
  As a developer
  I want to do a check on the expected routes to the backdrop stubs

  Scenario Outline: navigating to service
    When I go to <Location>
    Then I should receive the appropriate "<Json File>"
    
    Examples:
      | Location                                                                                                   | Json File                                       |
      | /backdrop-stub/licensing/realtime                                                                        | licensing_realtime.json                         |
      | /backdrop-stub/licensing/monitoring                                                                      | licensing_availability_response.json            |
      | /backdrop-stub/licensing/application?filter_by=licenceUrlSlug:application-to-licence-a-street-collection | application-to-licence-a-street-collection.json |
