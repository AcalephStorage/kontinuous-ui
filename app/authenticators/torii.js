import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import Configuration from '../config/environment';

export default ToriiAuthenticator.extend({
  torii: Ember.inject.service(),

  providers: {
    'github': function(authResponse) {
      let baseURL = 'https://github.com/login/oauth/access_token';
      let data = JSON.stringify({
        client_id: Configuration.APP.githubClient.id,
        client_secret: Configuration.APP.githubClient.secret,
        code: authResponse.authorizationCode
      });

      return Ember.$.ajax({
        url: baseURL,
        type: 'POST',
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      })
      .then((response) => ({ accessToken: response.access_token }));
    }
  },

  authenticate(provider, options) {
    return this._super(provider, options)
      .then((authResponse) => {
        return this.get('providers')[provider](authResponse);
      });
  }
});
