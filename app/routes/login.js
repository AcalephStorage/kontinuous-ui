import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  session: Ember.inject.service(),

  actions: {
    login() {
      this.set('session.errorMessage', null);
      this.get('session').authenticate('authenticator:kontinuous', 'github-kontinuous')
        .catch((resp) => {
          this.set('session.errorMessage', resp.Message || "Failed to login.");
        });
    }
  },

  renderTemplate: function() {
    this.render({
      outlet: 'login'
    });
  },

});
