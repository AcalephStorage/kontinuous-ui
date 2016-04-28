import RESTAdapter from 'ember-data/adapters/rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Configuration from '../config/environment';

export default RESTAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizer:kontinuous',
  host: Configuration.APP.kontinuousAPI.host,
  namespace: `api/${Configuration.APP.kontinuousAPI.version}`

});
