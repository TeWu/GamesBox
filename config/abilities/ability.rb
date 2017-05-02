class Ability < BaseAbility
  GRANTING_ACTIONS = [:assign_all_roles, :assign_nongranting_roles]
  ADMIN_ROLES = [:admin]

  self.precondition = -> (user) { user.has_role?(:active) }

  protected

  def logged_in user
    can [:read, :update], main_models
  end

  def active user
  end

  def admin(*)
    can :manage, :all
  end


  ### Action aliases ###
  def action_aliases
    {
        :read => %i[ index show ],
        :create => :new,
        :update => :edit,
        :delete => :destroy,
        :modify => %i[ update destroy ]
    }
  end

  ### Subject groups ###
  def main_models
    @main_models ||= [User]
  end

end