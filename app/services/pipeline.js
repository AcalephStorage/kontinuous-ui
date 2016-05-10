import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),

  all: [],
  sortKey: ['name'],
  sorted: Ember.computed.sort('all', 'sortKey'),
  newRecord: null,

  // options for newRecord
  repoOptions: [],
  eventOptions: [
    {
      'key': 'push',
      'label': 'Push',
      'isSelected': true
    }, {
      'key': 'pull_request',
      'label': 'Pull Request',
      'isSelected': true
    }, {
      'key': 'deployment',
      'label': 'Deployment',
      'isSelected': false
    }
  ],
  //

  selectedEvents: Ember.computed.filterBy('eventOptions', 'isSelected', true),

  new() {
    let user = this.get('session.session.authenticated.user_id');
    let p = this.get('store').createRecord('pipeline', { login: user });
    this.set('newRecord', p);

    let promises = {
      repositories: this.get('store').findAll('repository'),
      pipelines: this.fetchAll(),
    };

    let promise = Ember.RSVP.hash(promises).then((data) => {
      let ps = data.pipelines.getEach('name');
      return data.repositories.reject((repo) => {
        return ps.contains(repo.get('full_name'));
      });
    }, () => ([]));

    let repoOptions = DS.PromiseArray.create({
      promise: promise
    });

    this.set('repoOptions', repoOptions);
  },

  find(params) {
    return this.get('store').queryRecord('pipeline', params);
  },

  fetchAll() {
    let ps = this.get('store').findAll('pipeline');
    this.set('all', ps);
    return ps;
  },

  save(record) {
    let events = this.get('selectedEvents').getEach('key');
    record.set('events', events);
    return record.save();
  },

  unload(record) {
    record.unloadRecord();
  },

});
