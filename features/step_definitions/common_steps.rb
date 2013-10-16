When(/^I go to (.*)$/) do |url|
  visit url
end

Then(/^I should receive the appropriate "(.*?)"$/) do |file_name|
  JSON.parse(page.html).should == JSON.parse(File.read(File.join(FEATURE_ROOT, "backdrop_stub_responses", file_name)))
end
