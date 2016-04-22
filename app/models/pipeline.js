import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {hasMany} from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
  owner: attr('string'),
  repo: attr('string'),
  login: attr('string'),
  events: attr('array', {defaultValue: ['push', 'pull_request']}),
  notif: attr('array'),
  builds: hasMany('build', {async: true}),

  name: Ember.computed('owner', 'repo', function() {
    let owner = this.get('owner'),
      repo = this.get('repo');

    return `${owner}/${repo}`;
  }),
  build_numbers: Ember.computed('builds.isFulfilled', function() {
    if (this.get('builds.isFulfilled')) {
      return this.get('builds').getEach('number');
    }
  }),
  last_build_number: Ember.computed.max('build_numbers'),
  latest_build: Ember.computed('last_build_number', function() {
    let n = this.get('last_build_number');
    if (n === -Infinity) {
      return;
    }
    return this.get('builds').findBy('number', n);
  })

});
