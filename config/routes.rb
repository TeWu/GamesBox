Rails.application.routes.draw do
  
  root to: 'auth#root'

  get 'login' => 'auth#login_page'
  post 'login' => 'auth#login'
  delete 'logout' => 'auth#logout'

  resources :users

end
