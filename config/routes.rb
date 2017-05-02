Rails.application.routes.draw do
  json_only = {constraints: lambda { |req| req.format == :json }}

  root to: 'auth#root'

  get 'login' => 'auth#login_page'
  post 'login' => 'auth#login'
  delete 'logout' => 'auth#logout'

  get 'users/(:id/(edit))' => 'single_page_apps#main', as: :main_app

  namespace :api, **json_only do
    resources :users, except: [:new, :edit]
  end

end
