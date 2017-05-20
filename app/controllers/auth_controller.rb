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
    redirect_to login_path, status: :see_other, notice: "Logged out"
  end

  def register_page
    @user = User.new
    @invite_key = params[:key]
  end

  def register
    @invite_key = params.require(:user)[:registration_invite_key]
    inviter = User.get_inviter_by_key(@invite_key)
    if inviter.is_a? User
      user_params = params.require(:user)
                          .permit(:username, :password, :password_confirmation, :display_name, :email)
                          .merge(invited_by: inviter, roles: GamesBox::CONFIG[:new_user_roles_default])
      @user = User.new(user_params)
      authorize! :create, @user
      if @user.save
        redirect_to login_path, flash: {username: @user.username, notice: "User registered successfully"}
      else
        render :register_page
      end
    else
      @user = User.new
      @invite_key_error = inviter
      render :register_page
    end
  end

end
