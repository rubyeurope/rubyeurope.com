class CreateConferences < ActiveRecord::Migration[7.1]
  def change
    create_table :conferences do |t|
      t.string :name
      t.string :description
      t.decimal :latitude
      t.decimal :longitude
      t.string :link
      t.string :img

      t.timestamps
    end
  end
end
