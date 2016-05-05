import JSONSerializer from 'ember-data/serializers/json';
import Configuration from '../config/environment';

export default JSONSerializer.extend({

  attrs: {
    latest_build: {embedded: 'always'}
  },

  _namespace: `/api/${Configuration.APP.kontinuousAPI.version}`,
  _path: 'pipelines',

  normalize(modelClass, resourceHash) {
    this._addLinks(resourceHash);
    return this._super(modelClass, resourceHash);
  },

  _addLinks(res) {
    res['links'] = {
      'builds': `${this._namespace}/${this._path}/${res.owner}/${res.repo}/builds`
    };
  }

});
