import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeResponse(store, primaryModelClass, _payload, id, requestType) {
    let key = primaryModelClass.modelName;

    let payload = {};
    payload[key] = { details: _payload, id: store._generateId(key) };

    return this._normalizeResponse(store, primaryModelClass, payload, id, requestType, true);
  }
});
