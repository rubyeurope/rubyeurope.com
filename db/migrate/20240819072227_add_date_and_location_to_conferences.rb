class AddDateAndLocationToConferences < ActiveRecord::Migration[7.1]
  def change
    add_column :conferences, :event_date, :string
    add_column :conferences, :location, :string
  end
end
