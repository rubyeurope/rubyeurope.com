class CreateMeetupRegistrationRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :meetup_registration_requests do |t|
      t.string :name
      t.string :email
      t.text :message

      t.timestamps
    end
  end
end
