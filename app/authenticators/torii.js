import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import Configuration from '../config/environment';

export default ToriiAuthenticator.extend({
  torii: Ember.inject.service()
});
