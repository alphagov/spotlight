Feature: Dashboard
  In order to manage my services
  As a service manager
  I want to check my service's performance
  
  Scenario: display description
    When I go view my dashboard
     And I wait for the page to be fully loaded
    Then I can report an error for the current page
     And I see the title "Non-Realistic Data Stub" 
     And I see the strapline "Strapline" 
     And I see the tagline "(this is not real data)"
    Then I should see the "realtime" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "realtime" module
    Then I should see the "journey" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "journey" module
    Then I should see the "availability" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "availability" module
    Then I should see the "completion_rate" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "completion_rate" module
    Then I should see the "completion_numbers" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "completion_numbers" module
    Then I should see the "multi_stats" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "multi_stats" module
    Then I should see the "grouped_timeseries" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "grouped_timeseries" module
    Then I should see the "grouped_timeseries_2" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "grouped_timeseries_2" module
