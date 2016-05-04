import RESTAdapter from 'ember-data/adapters/rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Configuration from '../config/environment';
import Ember from 'ember';
import DS from 'ember-data';

export default RESTAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizer:k8s',
  defaultSerializer: 'k8s',
  host: Configuration.APP.k8sAPI.host,
  namespace: `api/${Configuration.APP.k8sAPI.version}`,

  pathForType(modelName) {
    var trimmed = modelName.replace(/^k8s-+/, '');
    return trimmed.pluralize();
  },

  _setNamespace(type, snapshot) {
    var namespace = this.get('namespace');

    if (type.modelName !== 'namespace') {
      this.set('namespace', namespace + '/namespaces/' + this.serialize(snapshot).metadata.namespace);
    }

    return namespace;
  },

  queryRecord(store, type, _data) {
    let data = Ember.copy(_data);
    let path = this.pathForType(type.modelName);
    let urlParts = this.buildURL(type.modelName, null, null, path, data).split('/');
    urlParts.removeObject(path);

    if (Ember.isPresent(data.namespace) && Ember.isPresent(data.name)) {
      urlParts.push('namespaces', data.namespace);
      urlParts.push(path, data.name);
      delete data.namespace;
      delete data.name;
    }

    let url = urlParts.join('/');
    return this.ajax(url, "GET", { data: data });
  },

  handleResponse(status, headers, payload) {
    if (payload.hasOwnProperty('kind') && payload.kind === 'Status' && (payload.code >= 400 && payload.code <= 500)) {
      return new DS.AdapterError(payload);
    }
    return this._super(...arguments);
  }
});
