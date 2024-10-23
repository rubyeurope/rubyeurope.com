class Announcement < ApplicationRecord
  validates_uniqueness_of :slug
end
