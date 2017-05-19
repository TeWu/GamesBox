module ApplicationHelper

  def expose_rails_env_data_to_javascript_tag
    javascript_tag %Q<
      this.App || (this.App = {});
      this.App.currentUser = {displayName: "#{current_user.try(:display_name)}"};
      this.App.sounds = {board_tap: "#{asset_url('board_tap.mp3')}"};
    >
  end

end
