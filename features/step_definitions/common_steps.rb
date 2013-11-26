When(/^I go to (.*)$/) do |url|
  visit url
end

And(/I wait for the page to be fully loaded/) do
  page.should have_css('body.ready')
end

Then(/^the status code should be (\d*)/) do |status_code|
  page.status_code.should == status_code.to_i
end

Then(/^I should receive the appropriate "(.*?)"$/) do |file_name|
  JSON.parse(page.document.text).should == JSON.parse(File.read(File.join(PROJECT_ROOT, "app/support/backdrop_stub/responses", file_name)))
end

Then(/^I can report an error for the current page$/) do
  page.should have_css('.report-a-problem-container', :visible => false)
  page.find('.report-a-problem-toggle a').click
  page.should have_css('.report-a-problem-container', :visible => true)
end
