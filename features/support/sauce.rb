if ENV['CUCUMBER_PROFILE'] == 'sauce'
  require 'sauce'
  require 'sauce/cucumber'
  require 'sauce/capybara'

  Capybara.default_driver = :sauce 

  Sauce.config do |c|
    c[:start_tunnel] = true

    c[:browsers] = [["Linux", "Chrome", nil]]
  end

  Before do
    Sauce::Capybara::Cucumber.before_hook
  end

  Around do |scenario, block|
    Sauce::Capybara::Cucumber.around_hook scenario, block
  end

  at_exit do
    Sauce::Utilities::Connect.close
  end 
end
