When(/^I check the status page$/) do
  visit '/_status'
end

Then(/^status should be "(.*?)"$/) do |expected_status|
  expect(page).to have_content "{ \"status\": \"#{expected_status}\" }"
end
