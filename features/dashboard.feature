Feature: Dashboard
  In order to manage my services
  As a service manager
  I want to check my service's performance

  Scenario: display description
    When I go view my dashboard
    Then I see the title "Non-Realistic Data Stub" 
     And I see the strapline "Service represents test data, and not related to any real dashboard. Figures on this page include only applications processed in the UK on GOV.UK." 
     And I see the tagline "(this is not real data)"
    Then I should see the "realtime" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "realtime" module
    Then I should see the "journey" module fallback for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "journey" module
    Then I should see the "availability" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "availability" module
