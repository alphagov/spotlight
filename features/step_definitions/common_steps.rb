When(/^I go to (.*)$/) do |url|
  visit url
end

Then(/^the status code should be (\d*)/) do |status_code|
  page.status_code.should == status_code.to_i
end

Then(/^I should receive the appropriate "(.*?)"$/) do |file_name|
  JSON.parse(page.document.text).should == JSON.parse(File.read(File.join(PROJECT_ROOT, "app/support/backdrop_stub/responses", file_name)))
end
