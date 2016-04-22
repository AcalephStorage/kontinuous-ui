import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

export default Model.extend({
  owner: attr('string'),
  repo: attr('string'),
  login: attr('string'),
  events: attr('array', {defaultValue: ['push', 'pull_request']}),
  notif: attr('array'),
  latest_build: attr(),

  name: Ember.computed('owner', 'repo', function() {
    let owner = this.get('owner'),
      repo = this.get('repo');

    return `${owner}/${repo}`;
  })
});
