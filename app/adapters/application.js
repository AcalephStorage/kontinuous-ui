import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Configuration from '../config/environment';

export default DS.RESTAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizer:kontinuous',
  host: Configuration.APP.kontinuousAPI.host,
  namespace: `api/${Configuration.APP.kontinuousAPI.version}`,

  handleResponse(status, headers, payload) {
    if (payload && payload.hasOwnProperty('Code') && (payload.Code >= 400 && payload.Code <= 500)) {
      return new DS.AdapterError(payload);
    }
    return this._super(...arguments);
  }

});
