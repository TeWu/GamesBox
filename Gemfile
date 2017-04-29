source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


gem 'rails', '~> 5.1.0'  # Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'pg', '~> 0.18'  # Use postgresql as the database for Active Record
gem 'puma', '~> 3.7'  # Use Puma as the app server
gem 'sass-rails', '~> 5.0'  # Use SCSS for stylesheets
gem 'uglifier', '>= 1.3.0'  # Use Uglifier as compressor for JavaScript assets
gem 'webpacker'  # Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'coffee-rails', '~> 4.2'  # Use CoffeeScript for .coffee assets and views
gem 'turbolinks', '~> 5'  # Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'jbuilder', '~> 2.5'  # Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'redis', '~> 3.0'  # Use Redis adapter to run Action Cable in production

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13.0'
  gem 'selenium-webdriver'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  gem 'pry-rails', '~> 0.3' # Use Pry REPL as Rails console
end


gem 'argon2' # Password hashing with Argon2 - OWASP recommended algorithm and the Password Hashing Competition winner https://github.com/P-H-C/phc-winner-argon2
gem 'cancancan', github: 'TeWu/cancancan', branch: 'develop' # For authorization. Using develop branch for as much Rails 5 support as possible.

gem 'stringex' # For pretty url id segments

gem 'autoprefixer-rails' # Adds vendor prefixes to CSS rules, using the Asset Pipeline
