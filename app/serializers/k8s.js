import JSONSerializer from 'ember-data/serializers/json';
import Ember from 'ember';

export default JSONSerializer.extend({

  primaryKey: 'metadata-uid',

  normalizeArrayResponse(store, primaryModelClass, rawPayload, id, requestType) {
    let payload = rawPayload.items;
    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalize: function(typeClass, hash) {
    // move metadata to root level of hash with key `metadata-${key}`
    if (hash && hash.hasOwnProperty('metadata')) {
      for (let key in hash.metadata) {
        let metaKey = `metadata-${key}`;
        hash[metaKey] = hash.metadata[key];
      }
      delete hash.metadata;
    }

    return this._super.apply(this, arguments);
  },

  keyForAttribute(key) {
    // https://godoc.org/k8s.io/kubernetes/pkg/api#ObjectMeta
    var metadataKeys = Ember.String.w("name generateName namespace selfLink uid resourceVersion generation creationTimestamp deletionTimestamp deletionGracePeriodSeconds");

    if (metadataKeys.contains(key)) {
      return `metadata-${key}`;
    }
    return key;
  }

});
