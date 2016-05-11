import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

  primaryKey: 'filename',

  normalize(modelClass, resourceHash) {
    if (resourceHash) {
      var filename = resourceHash.filename.split('/');
      resourceHash.title = filename.objectAt(filename.length - 1).replace(/\.log$/, '');
      resourceHash.content = atob(resourceHash.content);
    }
    return this._super(modelClass, resourceHash);
  },

});
