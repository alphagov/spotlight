Feature: Dashboard
  In order to manage my services
  As a service manager
  I want to check my service's performance

  Scenario: display description
    When I go to /performance/no-realistic-dashboard
     And I wait for the page to be fully loaded
    Then I can report an error for the current page
     And I see "3" crumbs in the breadcrumb trail
     And I see the title "Non-Realistic Data Stub"
     And I see the strapline "Performance"
     And I see the tagline "This dashboard shows information about how the Non-Realistic Data Stub service is currently performing."
     And I see the footer "description" section "A description of the Non-Realistic Data Stub service, just one sentence long."
     And I see the footer "service" section "Non-Realistic Service"
     And I see the footer "agency" section "Non-Realistic Agency"
     And I see the footer "department" section "Non-Realistic Department"
     And I see the footer "user type" section "Individuals"
     And I see the footer "service costs" section "Department budget"
     And I see the footer "extra description" section "Some more description about the Non-Realistic Data Stub."
     And I see the footer "notes on costs" section "Notes on costs, sometimes quite lengthy, go here."
     And I see the footer "other notes" section "And finally, other notes go here."
    Then I should see the "related-pages" information for "no-realistic-dashboard"
    Then I should see the "realtime" module for "no-realistic-dashboard" data
    Then I should see the "journey" module for "no-realistic-dashboard" data
    Then I should see the "availability" module for "no-realistic-dashboard" data
    Then I should see the "completion_rate" module for "no-realistic-dashboard" data
    Then I should see the "completion_numbers" module for "no-realistic-dashboard" data
    Then I should see the "multi_stats" module for "no-realistic-dashboard" data
    Then I should see the "tab_things-stacked_categories" module for "no-realistic-dashboard" data
