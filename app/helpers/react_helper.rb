module ReactHelper

  def react_component(name, **props)
    id = "react-#{name.underscore.dasherize}-#{rand(36**8).to_s(36)}"
    props = props.to_json.html_safe
    %Q{<div id="#{id}"></div> <script>window.mountReactComponent("#{name}", "#{id}", #{props})</script>}.html_safe
  end

end