json.extract! user, :id, :username, :roles, :is_admin, :display_name, :email, :invite_key, :invited_by, :created_at, :updated_at
json.url api_user_url(user)
