import Ember from 'ember';
import K8sAdapter from './k8s';

export default K8sAdapter.extend({

  defaultSerializer: 'k8s-log',

  pathForType() {
    return 'log';
  },

  queryRecord(store, type, _data) {
    let data = Ember.copy(_data);

    var urlParts = this.buildURL(type.modelName, null, null, "query", data).split('/');
    urlParts.removeObject(this.pathForType());

    if (Ember.isPresent(data.namespace) && Ember.isPresent(data.podName)) {
      urlParts.push('namespaces', data.namespace);
      urlParts.push('pods', data.podName);
      delete data.namespace;
      delete data.podName;
    }

    urlParts.push(this.pathForType());
    let url = urlParts.join('/');
    return this.ajax(url, "GET", { data: data });
  },

  ajaxOptions() {
    var hash = this._super.apply(this, arguments);
    hash.dataType = "text";
    return hash;
  }

});
