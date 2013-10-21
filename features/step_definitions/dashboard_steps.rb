When(/^I go view my dashboard$/) do
  visit "/performance/no-realistic-dashboard"
end

Then(/^I see the title "(.*?)"$/) do |expected_title|
  page.find("#content header h1").should have_content(expected_title)
end

Then(/^I see the strapline "(.*?)"$/) do |expected_strapline|
  page.find("#content header .strapline").should have_content(expected_strapline)
end

Then(/^I see the tagline "(.*?)"$/) do |expected_tagline|
  page.find("#content header .tagline").should have_content(expected_tagline)
end
