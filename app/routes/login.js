import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  actions: {
    login() {
      this.get('session').authenticate('authenticator:torii', 'github');
    }
  }

});
