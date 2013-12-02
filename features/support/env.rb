require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'rspec/expectations'
require 'json'
require 'pry-debugger'

PROJECT_ROOT = File.expand_path(File.join(__FILE__, "../../../"))
APP_PORT = 7070 # Saucelabs compatible port

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, :js_errors => false)
end
Capybara.default_driver = :poltergeist
Capybara.app_host = "http://localhost:#{APP_PORT}"
Capybara.server_port = APP_PORT
Capybara.run_server = false

$server = IO.popen("node app/server.js --env development_cucumber -p #{APP_PORT}")
$server.gets

at_exit do
  Process.kill("INT", $server.pid)
end
