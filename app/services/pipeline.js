import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),

  newRecord: null,
  allRecords: [],
  repoOptions: [],
  eventOptions: [{
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
  }],

  new() {
    let user = this.get('session.data.authenticated.profile.user_id');
    let p = this.get('store').createRecord('pipeline', { login: user });
    this.set('newRecord', p);

    let promises = {
      repositories: this.get('store').findAll('repository'),
      pipelines: this.all(),
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

  all() {
    if (this.get('store').peekAll('pipeline').get('length') === 0) {
      this.fetchAll();
    }
    return this.get('allRecords');
  },

  fetchAll() {
    let ps = this.get('store').findAll('pipeline');
    this.set('allRecords', ps);
    return ps;
  },

  unload(record) {
    // record.rollbackAttributes();
    record.unloadRecord();
  }

});
