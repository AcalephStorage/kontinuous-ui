import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

  primaryKey: 'filename',

  normalize(modelClass, resourceHash) {
    if (resourceHash && resourceHash.filename) {
      var filename = resourceHash.filename.split('/');
      let title = filename.objectAt(filename.length - 1);
      resourceHash.title = title.endsWith('.log') ? title : title.concat('.log');
    }
    return this._super(modelClass, resourceHash);
  },

});
