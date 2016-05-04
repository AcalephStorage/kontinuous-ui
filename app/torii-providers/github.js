import Oauth2Bearer from 'torii/providers/oauth2-bearer';
import QueryString from 'torii/lib/query-string';
import {configurable} from 'torii/configuration';
import Configuration from '../config/environment';

var GithubToken = Oauth2Bearer.extend({
  name:     'github-token',
  baseUrl:  'https://github.com/login/oauth/authorize',

  responseParams: ['code', 'state'],

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  }),

  open(options) {
    this._super(options).then((authData) => {
      let base = 'https://github.com/login/oauth/access_token';

      this.set('clientSecret', Configuration.APP.githubClient.secret);
      this.set('code', authData.authorizationToken.code);

      let qs = QueryString.create({
        provider: this,
        requiredParams: ['client_id', 'client_secret', 'code']
      });

      let url = [base, qs.toString()].join('?');

      return Ember.$.ajax({
        url: url,
        type: 'POST'
      }).then((response) => {
        return response;
      });
    });
  }

});

export default GithubToken;
