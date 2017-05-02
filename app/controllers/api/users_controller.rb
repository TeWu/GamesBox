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
      params.require(:user).permit(:username, :password, :password_confirmation, :roles_bitmask, :display_name, :email, :invite_key)
    end
  end
end
