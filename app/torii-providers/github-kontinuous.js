import Ember from 'ember';
import GithubOauth2Provider from 'torii/providers/github-oauth2';
import QueryString from 'torii/lib/query-string';
import Configuration from '../config/environment';

export default GithubOauth2Provider.extend({

  name: 'kontinuous-github-token',

  fetch(data) {
    return data;
  },

  open() {
    return this._super(...arguments)
      .then((authData) => {
        this.set('code', authData.authorizationCode);

        return new Ember.RSVP.Promise((resolve, reject) => {
          let base = `${Configuration.APP.kontinuousAPI.host}/login/github`;
          let qs = QueryString.create({
            provider: this,
            requiredParams: ['code', 'state']
          });

          let url = [base, qs.toString()].join('?');
          Ember.$.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
          })
          .then((response) => {
            Ember.run(() => {
              resolve({token: response});
            });
          }, (xhr) => {
            Ember.run(() => {
              reject(xhr.responseJSON);
            });
          });
        });
      });
  },

});
