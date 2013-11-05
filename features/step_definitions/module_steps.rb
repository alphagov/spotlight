def values
  {
    'realtime' => {
      'no-realistic-dashboard' => {
        title: 'Real-time usage',
        description: 'Real-time usage',
        raw: 15
      }
    }
  }
end

Then(/^I should see the "(.*?)" module for "(.*?)" data$/) do |display_module, service|
  page.find(".#{display_module} .visualisation").should have_content(values[display_module][service][:raw])
end

Then(/^I should not see other information for the "(.*?)" "(.*?)" module$/) do |service, display_module|
  p page.html
  page.find(".#{display_module}").should_not have_content(values[display_module][service][:title])
  page.find(".#{display_module}").should_not have_content(values[display_module][service][:description])
end

Then(/^I should see other information for the "(.*?)" "(.*?)" module$/) do |service, display_module|
  page.find(".#{display_module}").should have_content(values[display_module][service][:title])
  page.find(".#{display_module}").should have_content(values[display_module][service][:description])
end 
