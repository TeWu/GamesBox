class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :passhash, null: false, limit: 96
      t.integer :roles_bitmask, null: false, default: 0
      t.boolean :is_admin, null: false, default: false
      t.string :display_name, null: false
      t.string :email, null: false
      t.string :url_segment, null: false
      t.string :invite_key, null: false, limit: 16
      t.column :invited_by, :bigint, index: true
      t.timestamps
    end
    add_index :users, :username, unique: true
    add_index :users, :display_name, unique: true
    add_index :users, :url_segment, unique: true
    add_index :users, :is_admin
    add_foreign_key :users, :users, column: :invited_by
  end
end
