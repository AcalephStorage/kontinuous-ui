import Ember from 'ember';
import DS from 'ember-data';

// https://gist.github.com/NuckChorris/927d7d4ba757abd26b30
export default DS.Transform.extend({
  deserialize(value) {
    if (Ember.isArray(value)) {
      return Ember.A(value);
    } else {
      return Ember.A();
    }
  },
  serialize(value) {
    if (Ember.isArray(value)) {
      return Ember.A(value);
    } else {
      return Ember.A();
    }
  }
});
