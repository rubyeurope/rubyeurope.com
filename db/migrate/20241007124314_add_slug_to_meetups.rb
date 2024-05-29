class AddSlugToMeetups < ActiveRecord::Migration[7.1]
  def change
    add_column :meetups, :slug, :string
  end
end
