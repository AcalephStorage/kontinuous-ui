import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Configuration from '../config/environment';
import Ember from 'ember';

export default DS.RESTAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizer:kontinuous',
  host: Configuration.APP.kontinuousAPI.host,
  namespace: `api/${Configuration.APP.kontinuousAPI.version}`,

  handleResponse(status, headers, payload) {
    if (payload && payload.hasOwnProperty('Code') && (payload.Code >= 400 && payload.Code <= 500)) {
      return new DS.AdapterError(payload);
    }
    return this._super(...arguments);
  },


  queryRecord(store, type, query) {
    var q = Ember.copy(query),
        url = this.buildURL(type.modelName, null, null, "queryRecord", q);

    if (this.sortQueryParams) {
      q = this.sortQueryParams(q);
    }

    return this.ajax(url, "GET", { data: q });
  },

  query(store, type, query) {
    var q = Ember.copy(query),
        url = this.buildURL(type.modelName, null, null, "query", q);

    if (this.sortQueryParams) {
      q = this.sortQueryParams(q);
    }

    return this.ajax(url, "GET", { data: q });
  },

  urlForQueryRecord: function(query, modelName) {
    var urlParts = this._buildURL(modelName).split('/');

    if (Ember.isPresent(query.owner) && Ember.isPresent(query.repo)) {
      urlParts.push(query.owner, query.repo);
      delete query.owner;
      delete query.repo;
    }
    return urlParts.join('/');
  },

});
