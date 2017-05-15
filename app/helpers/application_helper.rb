module ApplicationHelper

  def expose_current_user_to_javascript_tag
    javascript_tag %Q<
      this.App || (this.App = {});
      this.App.currentUser = {displayName: "#{current_user.try(:display_name)}"};
    >.gsub(/\s/,'')
  end

end
