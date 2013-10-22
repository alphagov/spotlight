Feature: Status codes
  As a user
  I want the app to send the correct status codes

  Scenario: a known page type returns a 200 OK
    When I go to /performance/no-realistic-dashboard
    Then the status code should be 200

  Scenario: an unknown page type returns 501 Not Implemented
    When I go to /performance/services
    Then the status code should be 501

  Scenario: a non-existent Stagecraft page returns a 404 Not Found
    When I go to /performance/theres-no-page-here
    Then the status code should be 404
