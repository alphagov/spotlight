Feature: Healthcheck
  In order to be sure the system is running
  As a system administrator
  I want to do a check on the status of the system

  Scenario: check the system is running
    When I go to /_status
    Then the status should be "ok"
