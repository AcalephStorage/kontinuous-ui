import Ember from 'ember';
import Base from 'auth0-ember-simple-auth/authenticators/lock';
import Configuration from '../config/environment';

export default Base.extend({

  saveToDeploy: function(data) {
    var gh = data.profile.identities.find(function(item) {
      return item.connection === 'github';
    });

    data.deployToken = gh.access_token;

    Ember.$.ajax({
      url: `${Configuration.APP.deployEndpoint}/api/v1/pipelines/login`,
      type: 'POST',
      headers: {
        'Authorization': `Bearer ${data.jwt}`
      },
      data: JSON.stringify({
        id: data.profile.user_id,
        name: data.profile.nickname,
        access_token: gh.access_token,
      }),
      contentType: 'application/json;charset=utf-8',
      dataType: 'json'
    });

    return data;
  },

  afterAuth: function(data) {
    var sess = this.saveToDeploy(data);
    return Ember.RSVP.resolve(sess);
  },

  afterRestore: function(data) {
    var sess = this.saveToDeploy(data);
    return Ember.RSVP.resolve(sess);
  },

  afterRefresh: function(data) {
    var sess = this.saveToDeploy(data);
    return Ember.RSVP.resolve(sess);
  }

});
