import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({

  urlForQuery: function(query, modelName) {
    var urlParts = this._buildURL(modelName).split('/');
    urlParts.removeObject(this.pathForType(modelName));

    if (Ember.isPresent(query.owner) && Ember.isPresent(query.repo) && Ember.isPresent(query.buildNumber) && Ember.isPresent(query.stageIndex)) {
      urlParts.push('pipelines', query.owner, query.repo, 'builds', query.buildNumber, 'stages', query.stageIndex);
      delete query.owner;
      delete query.repo;
      delete query.buildNumber;
      delete query.stageIndex;
    }
    urlParts.push(this.pathForType(modelName));
    return urlParts.join('/');
  },

});
