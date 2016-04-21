import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

const {isEmpty} = Ember;

export default BaseAuthorizer.extend({

  authorize: function(sessionData, block) {
    const token = sessionData.jwt;
    if (!isEmpty(token)) {
      block('Authorization', `Bearer ${token}`);
    }
  }

});
