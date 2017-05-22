module ApplicationHelper

  def expose_rails_env_data_to_javascript_tag
    javascript_tag %Q<
      this.App || (this.App = {});
      this.App.currentUser = {displayName: "#{current_user.try(:display_name)}"};
      this.App.sounds = {
        board_tap: "#{asset_url('board_tap.mp3')}",
        board_tap_echo: "#{asset_url('board_tap_echo.mp3')}"
      };
    >
  end

  def google_analytics_script_tag
    javascript_tag %q<(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-84663180-4', 'auto');ga('send', 'pageview');>
  end

end
