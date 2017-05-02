class User < ApplicationRecord
  include RolesBitmaskSerializerSupport
  include URLSegmentSupport[:display_name]

  belongs_to :invited_by, class_name: 'User', foreign_key: :invited_by,  required: false, inverse_of: :invited_users
  has_many :invited_users, class_name: 'User', foreign_key: :invited_by, dependent: :nullify, inverse_of: :invited_by

  validates :username, presence: true, uniqueness: true, length: {within: 3..255}
  validates :display_name, presence: true, uniqueness: true, length: {within: 3..30}
  validates :email, format: {with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/}
  validates :invite_key, presence: true, length: {is: 16}

  valid_password_length_range = 2..1_000
  validates :password, confirmation: true
  validates :password, presence: true, length: {in: valid_password_length_range}, on: :create
  validates :password, length: {in: valid_password_length_range}, allow_blank: true, on: :update

  after_initialize :regenerate_invite_key, if: :new_record?
  before_save :hash_password
  before_save { self.is_admin = is_admin }

  attr_accessor :password, :password_confirmation


  def self.get_inviter_by_key(invite_key)
    inviters = User.where(invite_key: invite_key)
    return "Invalid invite key" unless inviters.any?
    return "Duplicated invite key" if inviters.many?
    return inviters.first
  end

  def self.authenticate(username, password)
    user = find_by username: username
    return user if user && GamesBox::Crypt.verify_password(password, user.passhash)
    return nil
  end

  def self.guest_ability
    @guest_ability ||= Ability.new(nil)
  end

  def ability
    @ability ||= Ability.new(self)
  end
  delegate :can?, :cannot?, to: :ability

  def has_role?(role)
    roles.include? role.to_s
  end

  def has_any_role?(*roles)
    return self.roles.any? if roles.empty?
    roles = roles.flatten.map(&:to_s)
    (self.roles || []).any? { |role| role.in? roles }
  end

  def is_admin
    has_any_role?(Ability::ADMIN_ROLES)
  end
  alias_method :is_admin?, :is_admin

  def roles_string
    roles.each(&:to_s) * ", "
  end


  private

  def hash_password
    if password.present?
      self.passhash = GamesBox::Crypt.hash_password(password)
      self.password = self.password_confirmation = nil
    end
  end

  def regenerate_invite_key
    self.invite_key = rand(36**16).to_s(36)
  end

end
