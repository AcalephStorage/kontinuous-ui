import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  beforeModel (transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();

      // options: https://auth0.com/docs/libraries/lock/customization
      var lockOptions = {
        authParams:{scope: 'openid profile email'},
        responseType: 'token',
        connections: ['github', 'google-oauth2'],
        socialBigButtons: false,
        icon: 'assets/images/acaleph-logo.svg',
        closable: false,
      };
      this.get('session').authenticate('simple-auth-authenticator:lock', lockOptions);
    }
  },
});
