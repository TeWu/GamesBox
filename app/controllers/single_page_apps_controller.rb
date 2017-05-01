class SinglePageAppsController < ApplicationController
  skip_authorization_check
  layout false
end