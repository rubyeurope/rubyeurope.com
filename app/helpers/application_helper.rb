module ApplicationHelper
  def current_url_without_parameters
    request.base_url + request.path
  end
end
