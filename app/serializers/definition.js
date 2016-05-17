import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

  normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload && !payload.id) {
      payload.id = store._generateId(primaryModelClass.modelName);
    }
    return this.normalizeSingleResponse(...arguments);
  },

  normalizeSaveResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload && !payload.id) {
      payload.id = id;
    }
    return this.normalizeSingleResponse(...arguments);
  },
});
