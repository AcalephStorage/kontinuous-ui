import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),

  all: [],
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
  notifOptions: [
    {
      'type': 'slack',
      'label': 'Slack',
      'isSelected': false,
      'metadata': [
        {
          'key': 'username',
          'label': 'Username',
          'value': ''
        }, {
          'key': 'url',
          'label': 'URL',
          'value': ''
        }, {
          'key': 'channel',
          'label': 'Channel',
          'value': ''
        }
      ]
    }
  ],
  //

  selectedEvents: Ember.computed.filterBy('eventOptions', 'isSelected', true),
  selectedNotifs: Ember.computed.filterBy('notifOptions', 'isSelected', true),

  new() {
    let user = this.get('session.data.authenticated.profile.user_id');
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

    let notifs = this.get('selectedNotifs').map((n) => {
      let metadata = {};
      n.metadata.forEach((m) => {
        metadata[m.key] = m.value;
      });
      return {
        type: n.type,
        metadata: metadata
      };
    });
    record.set('notif', notifs);
    return record.save();
  },

  unload(record) {
    record.unloadRecord();
  },

});
