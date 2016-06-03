import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    try {
      return Base64.decode(serialized);
    } catch (e) {
      return "";
    }
  },

  serialize(deserialized) {
    try {
      return Base64.encode(deserialized);
    } catch (e) {
      return "";
    }
  }
});
