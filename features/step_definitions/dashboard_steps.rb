Then(/^I see the title "(.*?)"$/) do |expected_title|
  page.find("#content header h1").should have_content(expected_title)
end

Then(/^I see the strapline "(.*?)"$/) do |expected_strapline|
  page.find("#content header .strapline").should have_content(expected_strapline)
end

Then(/^I see the tagline "(.*?)"$/) do |expected_tagline|
  page.find("#content header .tagline").should have_content(expected_tagline)
end

Then(/^I should see the "(.*?)" information for "(.*?)"$/) do |section, service|
  section_values[section][service].each do |text|
    page.find(".#{section}").should have_content(text)
  end
end

def section_values
  {
    "related-pages" => {
      "no-realistic-dashboard" => [
        "Helping people to buy a home",
        "Increasing the number of available homes"
      ]
    }
  }
end
