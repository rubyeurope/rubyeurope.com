class MeetupRegistrationRequestsController < ApplicationController
  def new
    @page_title = "Contact us"
  end

  def create
    meetup_registration_request = MeetupRegistrationRequest.new(meetup_registration_request_params)

    if meetup_registration_request.save
      redirect_to root_path, notice: 'Thank you, your request has been sent.'
    else
      redirect_to root_path, alert: 'Oops, something went wrong, please try again.'
    end
  end

  private

  def meetup_registration_request_params
    params.require(:meetup_registration_request).permit(:name, :email, :message)
  end
end
