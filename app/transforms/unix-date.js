import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    if (serialized === 0) {
      return '';
    } else {
      return moment.unix(serialized);
    }
  },

  serialize(deserialized) {
    if (deserialized.length) {
      return moment(deserialized).unix();
    } else {
      return 0;
    }
  }
});
