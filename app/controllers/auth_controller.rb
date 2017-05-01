class AuthController < ApplicationController
  skip_authorization_check

  def root
    redirect_to (logged_in? ? main_app_path : login_path)
  end

  def login
    credentials = params.require(:credentials)
    user = User.authenticate(credentials[:username], credentials[:password])
    if user
      self.current_user = user
      redirect_to main_app_path
    else
      logout_current_user
      redirect_to login_path, flash: {username: credentials[:username], alert: "Incorrect username or password"}
    end
  end

  def logout
    logout_current_user
    redirect_to login_path, notice: "Logged out"
  end

end
