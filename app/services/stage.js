import Ember from 'ember';
import Configuration from '../config/environment';

export default Ember.Service.extend({

  pipeline: Ember.inject.service(),
  build: Ember.inject.service(),
  store: Ember.inject.service(),

  sortKey: ['index'],
  all: Ember.computed.sort('build.current.stages', 'sortKey'),

});
