require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'rspec/expectations'

APP_PORT = 7070 # Saucelabs compatible port

Capybara.default_driver = :poltergeist
Capybara.app_host = "http://localhost:#{APP_PORT}"
Capybara.server_port = APP_PORT
Capybara.run_server = false

Before do 
  $server = IO.popen("node app/server.js -p #{APP_PORT}")
  $server.gets
end 

After do
  Process.kill("INT", $server.pid)
end
