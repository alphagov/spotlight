def values
  {
    'realtime' => {
      'no-realistic-dashboard' => {
        title: 'Real-time usage',
        description: 'Real-time usage',
        raw: "//p[@class='impact-number']/strong[text()='15']",
        info: true
      }
    },
    'journey' => {
      'no-realistic-dashboard' => {
        title: 'Users at each stage',
        description: 'Number of users who completed important stages of the transaction last week',
        raw: "//*[name()='svg']"
      }
    },
    'availability' => {
      'no-realistic-dashboard' => {
        title: 'Service availability',
        description: '',
        raw: "//*[name()='svg']"
      }
    }
  }
end

Then(/^I should see the "(.*?)" module for "(.*?)" data$/) do |display_module, service|
  page.find(".#{display_module} .visualisation").should have_xpath(values[display_module][service][:raw])
end

Then(/^I should see the "(.*?)" module fallback for "(.*?)" data$/) do |display_module, service|
  page.find(".#{display_module}").should have_css(".visualisation-fallback")
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
  v = values[display_module][service]
  page.find(".#{display_module}").should have_content(v[:title])
  page.find(".#{display_module}").should have_content(v[:description])
  if v[:info]
    page.find(".#{display_module}").should have_content('more info')
  end
end 
