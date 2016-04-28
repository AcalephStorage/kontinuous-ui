import Base from 'ember-simple-auth/authorizers/base';
import Ember from 'ember';

const {isEmpty} = Ember;

export default Base.extend({
  authorize(data, block) {
    const token = data.jwt;
    if (!isEmpty(token)) {
      block('Authorization', `Bearer ${token}`);
    }
  }
});
