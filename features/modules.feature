Feature: Modules
  As a user
  I want to view modules in a variety of contexts
  So that I can see just the information I need

  Scenario: Raw module
    When I go to /performance/no-realistic-dashboard/realtime?raw
    Then I should see the "realtime" module for "no-realistic-dashboard" data
    And I should not see other information for the "no-realistic-dashboard" "realtime" module

  Scenario: Standalone module
    When I go to /performance/no-realistic-dashboard/realtime
    Then I see "2" crumbs in the breadcrumb trail
    Then I should see the "realtime" module for "no-realistic-dashboard" data
    And I should see other information for the "no-realistic-dashboard" "realtime" module
