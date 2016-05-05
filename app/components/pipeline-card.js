import Ember from 'ember';
import UILinkToComponent from './ui-link-to';

export default UILinkToComponent.extend({

  classNames: Ember.String.w('ui link card'),
  classNameBindings: ['latestBuild.status'],
  routeName: 'pipeline',

  sortByNumber: ['number:asc'],
  buildsByNumber: Ember.computed.sort('model.builds', 'sortByNumber'),
  latestBuild: Ember.computed.reads('buildsByNumber.lastObject'),
  statusIcon: Ember.computed('latestBuild.status', function() {
    switch(this.get('latestBuild.status')) {
      case 'SUCCESS':
        return 'check circle';
      case 'FAIL':
        return 'remove circle';
      case 'RUNNING':
        return 'circle';
      default:
        return 'circle notched';
    }
  }),
  latestBuildCommit: Ember.computed('latestBuild.commit', 'latestBuild.branch', function() {
    let commit = this.get('latestBuild.commit');
    let branch = this.get('latestBuild.branch');
    if (commit === branch) {
      return commit;
    } else {
      return commit.slice(0, 7);
    }
  }),

  githubRepoLink: Ember.computed('model.name', function() {
    let name = this.get('model.name');
    return `https://github.com/${name}`;
  }),
  githubCommitLink: Ember.computed('latestBuild.commit', function() {
    let repoLink = this.get('githubRepoLink');
    let commit = this.get('latestBuild.commit');
    return `${repoLink}/commit/${commit}`;
  }),
  githubUserLink: Ember.computed('latestBuild.author', function() {
    let author = this.get('latestBuild.author');
    return `https://github.com/${author}`;
  })

});
