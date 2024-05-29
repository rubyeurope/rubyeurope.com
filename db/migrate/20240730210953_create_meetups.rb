class CreateMeetups < ActiveRecord::Migration[7.1]
  def change
    create_table :meetups do |t|
      t.string :name
      t.text :description
      t.decimal :latitude
      t.decimal :longitude
      t.string :link
      t.string :img

      t.timestamps
    end
  end
end
