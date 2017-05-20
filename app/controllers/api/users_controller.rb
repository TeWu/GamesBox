module Api
  class UsersController < ApplicationController
    load_and_authorize_resource :user, find_by: :param

    def index
      @users = User.all
    end

    def create
      @user = User.new(user_params)
      if @user.save
        render :show, status: :created, location: api_user_path(@user)
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    def update
      if @user.update(user_params)
        render :show, status: :ok, location: api_user_path(@user)
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @user.destroy
      head :no_content
    end

    private
    def user_params
      params.require(:user)
        .permit(:username, :password, :password_confirmation, :display_name, :email, :invite_key)
        .merge(roles: authorized_roles_param)
        .tap do |user_params|
          if !user_params[:password].nil? && user_params[:password_confirmation].nil?
            user_params[:password_confirmation] = ""
          end
        end
    end

    def authorized_roles_param
      old_roles = (@user.present? && @user.persisted?) ? @user.roles : GamesBox::CONFIG[:new_user_roles_default]
      new_roles = params.require(:user)[:roles]
      raise(Exception, "Illegal roles param value") unless new_roles.nil? || new_roles.class == Array
      if new_roles.nil? || new_roles == old_roles
        old_roles
      elsif can?(:assign_all_roles, @user || User)
        new_roles
      elsif can?(:assign_nongranting_roles, @user || User)
        new_nongranting_roles = new_roles.select {|r| r.in? GamesBox::CONFIG[:nongranting_roles] }
        old_granting_roles = old_roles.select {|r| r.in? GamesBox::CONFIG[:granting_roles] }
        new_nongranting_roles + old_granting_roles
      else
        old_roles
      end
    end

  end
end
