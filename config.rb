require 'json'

pp_environment = ENV['NODE_ENV'] || 'development'
pp_config = JSON.parse(File.open("config/config.#{pp_environment}.json", 'r').read())

# Settings used by Compass when compiling image-path()
images_dir = 'public/stylesheets/'
http_images_path = "#{pp_config['assetPath']}stylesheets"
