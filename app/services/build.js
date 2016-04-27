import Ember from 'ember';

export default Ember.Service.extend({

  // Always bound in pipeline
  pipeline: Ember.inject.service(),

  all: Ember.computed.alias('pipeline.current.builds'),
  latest: Ember.computed.reads('sorted.lastObject'),
  current: null,

  sortKey: ['number'],
  sorted: Ember.computed.sort('all', 'sortKey'),

  init() {
    this.get('all').then(() => {
      let latest = this.get('latest');
      this.set('current', latest);
    });
  },

  next() {
    let current = this.get('current');
    let i = this.get('sorted').indexOf(current);
    let n = this.get('sorted').objectAt(i + 1);
    this.set('current', n);
  },

  prev() {
    let current = this.get('current');
    let i = this.get('sorted').indexOf(current);
    let p = this.get('sorted').objectAt(i - 1);
    this.set('current', p);
  }

});
