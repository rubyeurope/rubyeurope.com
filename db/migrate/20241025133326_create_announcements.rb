class CreateAnnouncements < ActiveRecord::Migration[7.1]
  def change
    create_table :announcements do |t|
      t.string :title
      t.string :slug
      t.text   :preview
      t.text   :description

      t.timestamps
    end
  end
end
