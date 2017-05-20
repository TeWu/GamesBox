class SinglePageAppsController < ApplicationController
  layout false

  def main
    authorize! :show, :app
  end

end