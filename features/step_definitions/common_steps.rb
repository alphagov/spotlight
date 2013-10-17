When(/^I go to (.*)$/) do |url|
  visit url
end

Then(/^I should receive the appropriate "(.*?)"$/) do |file_name|
  page.document.text.should == File.read(File.join(PROJECT_ROOT, "app/support/backdrop_stub/responses", file_name))# "{ \"status\": \"ok\" }"
end
