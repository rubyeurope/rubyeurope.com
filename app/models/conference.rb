class Conference < ApplicationRecord
  def serialize
    {
      dom_id: "conference_#{id}",
      name:,
      event_date:,
      location:,
      description:,
      latitude: latitude.to_f,
      longitude: longitude.to_f,
      link:,
      img:,
    }
  end
end
