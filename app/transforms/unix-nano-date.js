import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    if (serialized === 0) {
      return '';
    } else {
      return moment.unix(serialized/this.nano);
    }
  },

  serialize(deserialized) {
    if (deserialized.length) {
      return moment(deserialized).unix() * this.nano;
    } else {
      return 0;
    }
  }
});
