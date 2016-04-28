import Ember from 'ember';

export default Ember.Service.extend({

  pipeline: Ember.inject.service(),
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  sortKey: ['number'],
  // Always bound in pipeline
  all: Ember.computed.sort('pipeline.current.builds', 'sortKey'),
  latest: Ember.computed.reads('all.lastObject'),
  current: null,
  newRecord: null,

  next() {
    let current = this.get('current');
    if (this.get('current') === this.get('all.lastObject')) {
      return;
    }
    let i = this.get('all').indexOf(current);
    let n = this.get('all').objectAt(i + 1);
    this.set('current', n);
  },

  prev() {
    let current = this.get('current');
    if (this.get('current') === this.get('all.firstObject')) {
      return;
    }
    let i = this.get('all').indexOf(current);
    let p = this.get('all').objectAt(i - 1);
    this.set('current', p);
  },

  new() {
    let author = this.get('session.session.content.authenticated.profile.nickname');
    let pipeline = this.get('pipeline.current');
    let build = this.get('store').createRecord('build', {author: author, pipeline: pipeline});
    this.set('newRecord', build);
    return build;
  },

  save(record) {
    return record.save();
  }

});
