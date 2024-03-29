require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Gamesbox
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Autoloading and eager loading paths
    additional_load_paths = ['lib', 'config/abilities'].map { |p| config.root.join(p) }
    config.autoload_paths += additional_load_paths
    config.eager_load_paths += additional_load_paths
  end
end
