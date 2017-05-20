class Ability < BaseAbility
  GRANTING_ACTIONS = [:assign_all_roles, :assign_nongranting_roles]
  ADMIN_ROLES = [:admin]

  self.precondition = -> (user) { user.has_role?(:active) }

  protected

  def draw_guest
    can :create, User, is_admin: false
  end

  def logged_in user
  end

  def active user
    can :show, :app
    can :index, :game
    can :read, :game_session
    can [:read, :update], User, id: user.id
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
    @main_models ||= [:app, User, :game, :game_session]
  end

end