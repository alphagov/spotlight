Feature: Healthcheck
  In order to be sure the system is running
  As a system administrator
  I want to do a check on the status of the system

  Scenario: check the system is running
    When I check the status page
    Then status should be "ok"
