import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),

  sortKey: ['number'],
  // Always bound in pipeline
  _all: [],
  all: Ember.computed.sort('_all', 'sortKey'),
  latest: Ember.computed.reads('all.lastObject'),
  current: null,
  newRecord: null,

  new(pipeline) {
    let author = this.get('session.session.content.authenticated.profile.nickname');
    let build = this.get('store').createRecord('build', {author: author, pipeline: pipeline});
    this.set('newRecord', build);
    return build;
  },

  save(record) {
    return record.save();
  }

});
