import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import config from '../config/environment';

export default BaseAuthenticator.extend({

  tokenEndpoint: config.APP.k8sAPI.host + '/sessions/create',

  restore(data) {
    return Ember.RSVP.Promise((resolve, reject) => {
      if (Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate(options) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: this.tokenEndpoint,
        type: 'POST',
        data: JSON.stringify({
          username: options.username,
          password: options.password
        }),
      })
      .then((response) => {
        Ember.run(() => {
          resolve({token: response.id_token});
        });
      }, (xhr) => {
        Ember.run(() => {
          reject(xhr.responseText);
        });
      });
    });
  },

  invalidate() {
    return Ember.RSVP.resolve();
  }
});
