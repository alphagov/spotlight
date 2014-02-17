Then(/^the status should be "(.*?)"$/) do |expected_status|
  expect(page).to have_content "{ \"status\": \"#{expected_status}\" }"
end
