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
  page.should have_css("body.raw")
  # FIXME: This feature should assert that title and description in the module
  # are not present. At the moment, these are visually hidden but present in
  # the page. When running tests on Travis, the styles don't seem to get
  # applied correctly. As a workaround, we are just asserting that the correct
  # class get applied to the body, which triggers the appropriate styles.
end

Then(/^I should see other information for the "(.*?)" "(.*?)" module$/) do |service, display_module|
  page.find(".#{display_module}").should have_content(values[display_module][service][:title])
  page.find(".#{display_module}").should have_content(values[display_module][service][:description])
end 
