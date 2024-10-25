class MeetupsController < ApplicationController
  def index
    @meetups = Meetup.order(name: :asc)
    @page_title = 'Meetups'
  end
end
