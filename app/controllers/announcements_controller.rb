class AnnouncementsController < ApplicationController
  def index
    @announcements = announcements
    @page_title = 'News'
  end

  def show
    @announcement = announcements.find_by!(slug: params[:id])

    @ogimage = "/news/#{@announcement.slug}.jpg"
    @page_title = "News - #{@announcement.title}"

    @announcement_prev = announcements.where("created_at < ?", @announcement.created_at).first
    @announcement_next = announcements.where("created_at > ?", @announcement.created_at).last
  end

  private

  def announcements
    Announcement.order(created_at: :desc)
  end
end
