import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    try {
      return atob(serialized);
    } catch (e) {
      return "";
    }
  },

  serialize(deserialized) {
    try {
      return btoa(deserialized);
    } catch (e) {
      return "";
    }
  }
});
