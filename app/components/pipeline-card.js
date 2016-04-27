import Ember from 'ember';
import UILinkToComponent from './ui-link-to';

export default UILinkToComponent.extend({

  classNames: Ember.String.w('ui link card'),
  classNameBindings: ['latestBuild.status'],
  routeName: 'pipeline',

  _buildNumbers: Ember.computed('model.builds.isFulfilled', function() {
    if (this.get('model.builds.isFulfilled')) {
      return this.get('model.builds').getEach('number');
    }
  }),
  _lastBuildNumber: Ember.computed.max('_buildNumbers'),

  latestBuild: Ember.computed('_lastBuildNumber', function() {
    let n = this.get('_lastBuildNumber');
    if (n === -Infinity) {
      return;
    }

    let b = this.get('model.builds').findBy('number', n);

    if (b.get('commit') === this.get('branch')) {
      b.set('commitSHA', b.get('commit'));
    } else {
      b.set('commitSHA', b.get('commit').slice(0, 7));
    }

    return b;
  })

});
