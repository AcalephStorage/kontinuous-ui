import JSONSerializer from 'ember-data/serializers/json';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default JSONSerializer.extend(EmbeddedRecordsMixin, {

  attrs: {
    stages: {embedded: 'always'}
  },

});
