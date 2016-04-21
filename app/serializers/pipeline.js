import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

  attrs: {
    latest_build: {embedded: 'always'}
  }

});
