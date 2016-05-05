import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  pipeline: Ember.inject.service(),

  model(params) {
    return this.get('pipeline').find(params);
  }

});
