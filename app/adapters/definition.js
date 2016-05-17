import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({

  pathForType() {
    return "definition";
  },

  updateRecord(store, type, snapshot) {
    let pipeline = snapshot.record.get('pipeline');
    if (Ember.isNone(pipeline)) {
      return new DS.AdapterError();
    }

    let data = {};
    let serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, snapshot);

    let id = snapshot.id,
      url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

    return this.ajax(url, "POST", {data: data});
  },

  urlForUpdateRecord(id, modelName, snapshot) {
    var urlParts = this._buildURL(modelName).split('/');
    urlParts.removeObject(this.pathForType());

    var owner = snapshot.record.get('pipeline.owner'),
        repo = snapshot.record.get('pipeline.repo'),
        commit = snapshot.record.get('sha');

    if (Ember.isPresent(owner) && Ember.isPresent(repo) && Ember.isPresent(commit)) {
      urlParts.push('pipelines', owner, repo);
      urlParts.push(this.pathForType(), commit);
    }
    return urlParts.join('/');
  },

  urlForQueryRecord(query, modelName) {
    var urlParts = this._buildURL(modelName).split('/');
    urlParts.removeObject(this.pathForType());

    if (Ember.isPresent(query.owner) && Ember.isPresent(query.repo)) {
      urlParts.push("pipelines", query.owner, query.repo);
      delete query.owner;
      delete query.repo;
    }

    urlParts.push(this.pathForType());
    if (Ember.isPresent(query.ref)) {
      urlParts.push(query.ref);
      delete query.ref;
    }

    return urlParts.join('/');
  },

});
