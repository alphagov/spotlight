def values
  {
    'realtime' => {
      'no-realistic-dashboard' => {
        title: 'Live service usage',
        description: 'Live service usage',
        raw: "//span[@class='impact-number']/strong[text()='15']",
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
        raw: "//*[name()='svg']"
      }
    },
    'completion_rate' => {
      'no-realistic-dashboard' => {
        title: 'Completion rate',
        description: '',
        raw: "//*[name()='svg']"
      }
    },
    'completion_numbers' => {
      'no-realistic-dashboard' => {
        title: 'Applications',
        description: '',
        raw: "//*[name()='svg']"
      }
    },
    'multi_stats' => {
      'no-realistic-dashboard' => {
        title: 'Average first mortgage',
        description: 'A range of factors indicative of the state of the housing market for first-time buyers',
        raw: "//ul/li//p[@class='change impact-number increase']"
      }
    },
    'stacked_categories' => {
      'no-realistic-dashboard' => {
        title: 'Categories in a stack',
        description: '',
        raw: "//*[name()='svg']"
      }
    },
    'starts_completions' => {
      'no-realistic-dashboard' => {
        title: 'Categories as lines',
        description: '',
        raw: "//*[name()='svg']"
      }
    }
  }
end

def find_section_for(identifier)
  if page.has_css?("section##{identifier}")
    section = page.find("section##{identifier}")
  else
    section = page.find("section.#{identifier}")
  end
  section
end

Then(/^I should see the "(.*?)" module for "(.*?)" data$/) do |display_module, service|
  find_section_for(display_module).find(".visualisation").should have_xpath(values[display_module][service][:raw])
end

Then(/^I should see the "(.*?)" module fallback for "(.*?)" data$/) do |display_module, service|
  find_section_for(display_module).should have_css(".visualisation-fallback")
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
  find_section_for(display_module).should have_content(v[:title])
  if v[:description]
    find_section_for(display_module).should have_content(v[:description])
  end
  if v[:info]
    find_section_for(display_module).should have_content('About the data')
  end
end
