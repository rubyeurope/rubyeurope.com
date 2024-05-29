class AddSlugToConferences < ActiveRecord::Migration[7.1]
  def change
    add_column :conferences, :slug, :string
  end
end
