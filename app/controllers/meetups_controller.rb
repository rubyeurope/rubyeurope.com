class MeetupsController < ApplicationController
  def index
    @meetups = Meetup.order(name: :asc)
  end
end
