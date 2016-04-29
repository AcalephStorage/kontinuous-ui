import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({

  _getLogs(query) {
    let q = Ember.copy(query);
    let urlParts = this.urlForQueryRecord(q).split('/');
    urlParts.push('logs');
    let url = urlParts.join('/');
    return this.ajax(url, 'GET', {data: q});
  },

  urlForQueryRecord: function(query, modelName) {
    var urlParts = this._buildURL(modelName).split('/');

    if (Ember.isPresent(query.owner) && Ember.isPresent(query.repo) && Ember.isPresent(query.buildNumber) && Ember.isPresent(query.stageIndex)) {
      urlParts.push('pipelines', query.owner, query.repo, 'builds', query.buildNumber, 'stages', query.stageIndex);
      delete query.owner;
      delete query.repo;
      delete query.buildNumber;
      delete query.stageIndex;
    }
    return urlParts.join('/');
  },
});
