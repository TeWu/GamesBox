# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170429183633) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "passhash", limit: 96, null: false
    t.integer "roles_bitmask", default: 0, null: false
    t.boolean "is_admin", default: false, null: false
    t.string "display_name", null: false
    t.string "email", null: false
    t.string "url_segment", null: false
    t.string "invite_key", limit: 16, null: false
    t.bigint "invited_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["display_name"], name: "index_users_on_display_name", unique: true
    t.index ["invited_by"], name: "index_users_on_invited_by"
    t.index ["is_admin"], name: "index_users_on_is_admin"
    t.index ["url_segment"], name: "index_users_on_url_segment", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "users", "users", column: "invited_by"
end