module RolesBitmaskSerializerSupport
  extend ActiveSupport::Concern

  RolesBitmaskSerializer = GamesBox::Serializers::RolesBitmaskSerializer

  included do

    after_initialize { self.send(:roles=, RolesBitmaskSerializer.load(self.roles_bitmask), bypass_sync: true) }

    def roles_bitmask=(roles_bitmask, **options)
      super(roles_bitmask)
      self.send(:roles=, RolesBitmaskSerializer.load(self.roles_bitmask), bypass_sync: true) unless options[:bypass_sync]
    end

    attr_reader :roles
    def roles=(roles, **options)
      @roles = roles
      self.send(:roles_bitmask=, RolesBitmaskSerializer.dump(self.roles), bypass_sync: true) unless options[:bypass_sync]
    end

    def add_role(role)
      self.roles += [role]
    end

    def remove_role(role)
      self.roles -= [role]
    end

  end
end