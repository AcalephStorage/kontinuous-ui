import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

const {isEmpty} = Ember;

export default BaseAuthorizer.extend({

  authorize(sessionData, block) {
    const token = sessionData.token;
    if (!isEmpty(token)) {
      block('Authorization', `Bearer ${token}`);
    }
  }

});
