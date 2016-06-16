import ApplicationAdapter from './application';
import Ember from 'ember';
import QueryString from 'torii/lib/query-string';


export default ApplicationAdapter.extend({

  updateRecord(store, type, snapshot) {
    var data = {},
      url = this.buildURL(type.modelName, null, snapshot, 'updateRecord');

    var serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, snapshot);

    if (data.type === 'wait') {
      let qs = QueryString.create({
        provider: { continue: 'yes' },
        requiredParams: ['continue']
      });
      url = [url, qs.toString()].join('?');
    }

    return this.ajax(url, 'POST', { data: {} });
  },

  urlForQueryRecord(query, modelName) {
    var urlParts = this._buildURL(modelName).split('/');

    if (Ember.isPresent(query.owner) && Ember.isPresent(query.repo) && Ember.isPresent(query.buildNumber) && Ember.isPresent(query.stageIndex)) {
      urlParts.push('pipelines', query.owner, query.repo);
      urlParts.push('builds', query.buildNumber);
      urlParts.push('stages', query.stageIndex);
      delete query.owner;
      delete query.repo;
      delete query.buildNumber;
      delete query.stageIndex;
    }

    return urlParts.join('/');
  },

  urlForUpdateRecord(id, modelName, snapshot) {
    var urlParts = this._buildURL(modelName).split('/');
    urlParts.removeObject(this.pathForType(modelName));

    let pipelineName = snapshot.record.get('build.pipeline.name'),
      buildNumber = snapshot.record.get('build.number'),
      index = snapshot.record.get('index');

    if (Ember.isPresent(pipelineName) && Ember.isPresent(buildNumber) && Ember.isPresent(index)) {
      urlParts.push('pipelines', pipelineName);
      urlParts.push('builds', buildNumber);
      urlParts.push('stages', index);
    }

    return urlParts.join('/');
  }

});
