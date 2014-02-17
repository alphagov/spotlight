Feature: Dashboard
  In order to manage my services
  As a service manager
  I want to check my service's performance

  Scenario: display description
    When I go to /performance/no-realistic-dashboard
     And I wait for the page to be fully loaded
    Then I can report an error for the current page
     And I see "1" crumb in the breadcrumb trail
     And I see the title "Non-Realistic Data Stub"
     And I see the strapline "Performance"
     And I see the tagline "(this is not real data)"
    Then I should see the "related-pages" information for "no-realistic-dashboard"
    Then I should see the "realtime" module for "no-realistic-dashboard" data
    Then I should see the "journey" module for "no-realistic-dashboard" data
    Then I should see the "availability" module for "no-realistic-dashboard" data
    Then I should see the "completion_rate" module for "no-realistic-dashboard" data
    Then I should see the "completion_numbers" module for "no-realistic-dashboard" data
    Then I should see the "multi_stats" module for "no-realistic-dashboard" data
    Then I should see the "stacked_categories" module for "no-realistic-dashboard" data
    Then I should see the "starts_completions" module for "no-realistic-dashboard" data
