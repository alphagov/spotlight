require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'rspec/expectations'

Capybara.default_driver = :poltergeist
Capybara.app_host = 'http://localhost:3057'
Capybara.run_server = false

Before do 
  $server = fork { exec 'node app/server.js' } 
  sleep 1
end 

After do
  Process.kill("INT", $server)
  Process.wait($server)
end
