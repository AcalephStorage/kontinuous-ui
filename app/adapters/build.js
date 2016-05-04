import ApplicationAdapter from './application';
import DS from 'ember-data';
import Ember from 'ember';

export default ApplicationAdapter.extend({

  createRecord: function (store, type, snapshot) {
    var pipeline = snapshot.record.get('pipeline');
    if (Ember.isNone(pipeline)) {
      return new DS.AdapterError();
    }
    var data = {},
        url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

    var serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, snapshot, { includeId: false });

    delete data.stages;

    return this.ajax(url, 'POST', {
      headers: {'X-Custom-Event': 'dashboard'},
      data: data,
    });
  },

  urlForCreateRecord(modelName, snapshot) {
    var urlParts = this._buildURL(modelName).split('/');
    urlParts.removeObject(this.pathForType(modelName));

    var owner = snapshot.record.get('pipeline.owner'),
        repo = snapshot.record.get('pipeline.repo');

    if (Ember.isPresent(owner) && Ember.isPresent(repo)) {
      urlParts.push('pipelines', owner, repo);
    }

    urlParts.push(this.pathForType(modelName));
    return urlParts.join('/');
  }
});
