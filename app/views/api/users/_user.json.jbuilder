json.extract! user, :id, :username, :roles, :is_admin, :display_name, :email, :url_segment, :invite_key, :created_at, :updated_at
json.invited_by user.invited_by.try(:display_name)
