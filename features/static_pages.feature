Feature: Static GOV.UK pages
  As a user interested in the Performance Platform
  I want to find out more by visiting GOV.UK
  So that I can be awesomely informed about government performance

  Scenario: Homepage
    When I go to /performance
    Then the status code should be 200
    And I should see the text "Our performance"

  Scenario: Prototypes page
    When I go to /performance/prototypes
    Then the status code should be 200
    And I should see the text "Performance prototypes"
