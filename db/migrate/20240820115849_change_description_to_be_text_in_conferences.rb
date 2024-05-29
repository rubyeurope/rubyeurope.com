class ChangeDescriptionToBeTextInConferences < ActiveRecord::Migration[7.1]
  def change
    change_column :conferences, :description, :text
  end
end
