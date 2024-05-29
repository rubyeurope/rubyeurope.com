class ConferencesController < ApplicationController
  def index
    @page_title = "Ruby Conferences in Europe"
    @conferences = Conference.order(name: :asc)
  end
end
