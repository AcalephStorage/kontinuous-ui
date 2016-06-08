import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import {task} from 'ember-concurrency';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  session: Ember.inject.service(),

  actions: {
    login() {
      this.set('session.errorMessage', null);
      this.get('loginTask').perform();
    }
  },

  loginTask: task(function*() {
    yield this.get('session').authenticate('authenticator:kontinuous', 'github-kontinuous')
      .catch((resp) => {
        this.set('session.errorMessage', resp || "Failed to login.");
      });
  }).cancelOn('deactivate').drop(),

  renderTemplate: function() {
    this.render({
      outlet: 'login'
    });
  },

});
