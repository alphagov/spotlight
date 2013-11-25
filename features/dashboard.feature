Feature: Dashboard
  In order to manage my services
  As a service manager
  I want to check my service's performance
  
  Scenario: display description
    When I go view my dashboard
    Then I see the title "Non-Realistic Data Stub" 
     And I see the strapline "Strapline" 
     And I see the tagline "(this is not real data)"
    Then I should see the "realtime" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "realtime" module
# FIXME: Disabled pending reliable solution to client side module rendering
#    Then I should see the "journey" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "journey" module
# FIXME: Disabled pending reliable solution to client side module rendering
#    Then I should see the "availability" module for "no-realistic-dashboard" data
     And I should see other information for the "no-realistic-dashboard" "availability" module
