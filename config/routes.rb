Rails.application.routes.draw do
  json_only = {constraints: lambda { |req| req.format == :json }}

  root to: 'auth#root'

  get 'login' => 'auth#login_page'
  post 'login' => 'auth#login'
  delete 'logout' => 'auth#logout'
  get 'register' => 'auth#register_page', as: :registration
  post 'register' => 'auth#register'

  scope to: 'single_page_apps#main' do
    get 'users(/:id(/edit))'
    scope 'games' do
      root as: :main_app
      get ':id(/:session_id)'
      get ':id/private/:session_id'
    end
  end

  namespace :api, **json_only do
    resources :users, except: [:new, :edit]
    get 'game_sessions' => 'game_sessions#index'
  end

end
