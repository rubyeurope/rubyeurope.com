class Meetup < ApplicationRecord
  def serialize
    {
      dom_id: "meetup_#{id}",
      name:,
      description:,
      latitude: latitude.to_f,
      longitude: longitude.to_f,
      link:,
      img:,
    }
  end
end
