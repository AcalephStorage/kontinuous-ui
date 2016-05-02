import Ember from 'ember';
import UILinkToComponent from './ui-link-to';

export default UILinkToComponent.extend({

  classNames: Ember.String.w('ui link card'),
  classNameBindings: ['latestBuild.status'],
  routeName: 'pipeline',

  sortByNumber: ['number:asc'],
  buildsByNumber: Ember.computed.sort('model.builds', 'sortByNumber'),
  latestBuild: Ember.computed.reads('buildsByNumber.lastObject'),

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
